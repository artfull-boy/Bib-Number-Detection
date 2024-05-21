from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import cv2
import easyocr
from werkzeug.utils import secure_filename
from ultralytics import YOLO
import re
import json

app = Flask(__name__)
CORS(app)

model_path = 'best.pt'
model = YOLO(model_path)
reader = easyocr.Reader(['en'])

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'public', 'Marathons')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def clean_text(text):
    return re.sub(r'\D', '', text)

def preprocess_image(cropped_image):
    gray = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
    equalized = cv2.equalizeHist(gray)
    resized = cv2.resize(equalized, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)
    return resized

def get_image_paths(bib_number):
    json_path = os.path.join('src', 'bib_numbers.json')
    found_images = []

    if os.path.exists(json_path):
        with open(json_path, 'r') as json_file:
            results = json.load(json_file)

        for result in results:
            if bib_number in result['bib_numbers']:
                found_images.append(result['filename'])

    return found_images

def save_marathon_details(id, marathon_name, desc, km, date, picture_names):
    json_path = os.path.join('src', 'Marathons.json')
    marathon_folder = f"/Marathons/{marathon_name.replace(' ', '')}"
    marathon_details = {
        'id': id,
        'Name': marathon_name,
        'Description': desc,
        'Distance': km,
        'Date': date,
        'Pictures': picture_names,
        'Folder': marathon_folder,
        'Photographer': 'Ilias Rais'
    }

    try:
        if os.path.exists(json_path):
            with open(json_path, 'r') as json_file:
                try:
                    marathons = json.load(json_file)
                except json.JSONDecodeError:
                    marathons = []
        else:
            marathons = []

        marathons.append(marathon_details)

        with open(json_path, 'w') as json_file:
            json.dump(marathons, json_file, indent=4)

    except Exception as e:
        app.logger.error(f"Error saving marathon details: {e}")
        raise

@app.route('/upload', methods=['POST'])
def upload_files():
    id = request.form.get('id')
    marathon_name = request.form.get('marathon_name')
    desc = request.form.get('desc')
    km = request.form.get('km')
    date = request.form.get('date')

    if 'images' not in request.files:
        return jsonify({'error': 'No files part in the request'}), 400
    
    files = request.files.getlist('images')
    if not marathon_name or not desc or not km or not date or len(files) == 0:
        return jsonify({'error': 'Missing marathon details or files'}), 400


    marathon_folder = os.path.join(app.config['UPLOAD_FOLDER'], marathon_name.replace(" ", ""))
    try:
        os.makedirs(marathon_folder, exist_ok=True)
        app.logger.info(f"Created directory: {marathon_folder}")
    except Exception as e:
        app.logger.error(f"Error creating directory {marathon_folder}: {e}")
        return jsonify({'error': f"Error creating directory: {e}"}), 500
    
    results = []
    picture_names = []
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(marathon_folder, filename)
            picture_names.append(filename)
            try:
                file.save(file_path)
                app.logger.info(f"Saved file: {file_path}")
                
                
                image = cv2.imread(file_path)
                yolo_results = model.predict(source=image)
                bib_numbers = set()

                for result in yolo_results:
                    for box in result.boxes.xyxy:
                        x1, y1, x2, y2 = map(int, box)
                        cropped_image = image[y1:y2, x1:x2]
                        preprocessed_image = preprocess_image(cropped_image)
                        ocr_result = reader.readtext(preprocessed_image)

                        for detection in ocr_result:
                            text = detection[1]
                            cleaned_text = clean_text(text)
                            if cleaned_text:
                                bib_numbers.add(cleaned_text)

                results.append({'Marathon_name':marathon_name,'filename': filename, 'bib_numbers': list(bib_numbers)})

            except Exception as e:
                app.logger.error(f"Error saving or processing file {file_path}: {e}")
                return jsonify({'error': f"Error saving or processing file: {e}"}), 500

    bib_numbers_json_path = os.path.join('src', 'bib_numbers.json')
    try:
        if os.path.exists(bib_numbers_json_path):
            with open(bib_numbers_json_path, 'r') as json_file:
                try:
                    existing_results = json.load(json_file)
                except json.JSONDecodeError:
                    existing_results = []
        else:
            existing_results = []

        with open(bib_numbers_json_path, 'w') as json_file:
            json.dump(existing_results + results, json_file)
        app.logger.info(f"Saved results to {bib_numbers_json_path}")
    except Exception as e:
        app.logger.error(f"Error saving results to {bib_numbers_json_path}: {e}")
        return jsonify({'error': f"Error saving results: {e}"}), 500

    try:
        save_marathon_details(id, marathon_name, desc, km, date, picture_names)
        app.logger.info(f"Saved marathon details to src/marathons.json")
    except Exception as e:
        app.logger.error(f"Error saving marathon details: {e}")
        return jsonify({'error': f"Error saving marathon details: {e}"}), 500

    return jsonify({"message": "Files processed successfully", "results": results})

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True, port=5000)
