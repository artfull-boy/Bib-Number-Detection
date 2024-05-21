import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { UploadIcon } from "lucide-react";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../components/ui/calendar";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import jsonFile from "../Marathons.json"

const Photographer = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const onFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };
  const maxId = jsonFile.reduce((max, marathon) => Math.max(max, Number(marathon.id)), 0);
  const newId = maxId + 1;
  const [marathon_name, setMarathon_name] = useState("");
  const [desc, setDesc] = useState("");
  const [km, setKm] = useState("");
  const [date, setDate] = useState("");
  const [alertL, setAlertL] = useState("hidden");
  const [alertW, setAlertW] = useState("hidden");

  const submitForm = (e) => {
    e.preventDefault();
    try {


      const onFileUpload = () => {
        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("images", selectedFiles[i]);
        }
        formData.append("id",newId.toString())
        formData.append("marathon_name", marathon_name);
        formData.append("desc", desc);
        formData.append("km", km);
        formData.append("date", date.toISOString());

        axios.post("http://localhost:5000/upload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).catch(error => {
          console.error("There was an error uploading the files!", error); 
        });
      };

      onFileUpload();
      setMarathon_name("");
      setDesc("");
      setKm("");
      setDate("");
      setSelectedFiles(null);
      document.querySelector('#inputfile').value = "";
      setAlertL("hidden");
      setAlertW("block");
      
    } catch (error) {
      console.error("Error storing data in localStorage:", error);
      setAlertL("block");
      setAlertW("hidden");
    }
  };

  const getIsFormValid = () => {
    return marathon_name && desc && km && date && selectedFiles;
  };

  return (
    <div className="w-full flex flex-col gap-20 justify-center items-center pb-32">
      <div className="navbar flex w-full justify-between px-9 py-[20px]">
      <Link to={'/'}>
        <img
          src={`${process.env.PUBLIC_URL}/images/logo.png`}
          className="w-[154px]"
        ></img>
        </Link>
        <Link to={"/marathons"}>
          <Button className=" w-fit bg-[#FAFAFA] text-[#09090B] hover:bg-[#FAFAFA] hover:text-[#09090B]">
            See All Marathons
          </Button>
        </Link>
      </div>
      <div className="w-[420px] rounded-[12px] gap-[24px] border-[#3F3F46] border-[1px] flex flex-col p-[24px] bg-[#09090B]">
        <div className="w-full h-[56px] flex justify-center items-center">
          <Link to={"/"} className="flex justify-start w-full">
            <div className="flex items-center justify-start w-full">
              <img
                src={`${process.env.PUBLIC_URL}/images/left.png`}
                className="w-[20px] h-[20px]"
              ></img>
              <p className="text-[#FAFAFA] text-[16px] font-medium leading-[24px]">
                Back
              </p>
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-[8px] ">
          <p className="text-[#FAFAFA] text-[30px] font-semibold tracking-tighter">
            Upload Marathon Pictures
          </p>
          <p className="text-[#A1A1AA] text-[14px] font-normal leading-[20px]">
            Please upload the Marathon's informations and pictures.
          </p>
        </div>
        <div className="flex flex-col gap-[15px] items-center">
          <form
            className="flex flex-col gap-[15px] items-center w-full"
            onSubmit={submitForm}
          >
            <Input
              type="text"
              placeholder="Enter Marathon's Name"
              className=" w-full"
              value={marathon_name}
              onChange={(e) => setMarathon_name(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Enter Marathon's Description"
              className=" w-full"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Enter Marathon's Distance"
              className=" w-full"
              value={km}
              onChange={(e) => setKm(e.target.value)}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={"w-full pl-3 text-left font-normal"}
                >
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  value={date}
                  selected={date}
                  onSelect={(selectedDate) => setDate(selectedDate)}
                />
              </PopoverContent>
            </Popover>
            <Input
              type="file"
              multiple
              id="inputfile"
              onChange={onFileChange}
              className=" w-full"
            />
            <Button
              type="submit"
              disabled={!getIsFormValid()}
              className=" w-full bg-[#FAFAFA] text-[#09090B] hover:bg-[#FAFAFA] hover:text-[#09090B]"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Marathon
            </Button>
            <Link to={"/marathons"} className="w-full">
              <Button
                variant="secondary"
                className="bg-[#27272A] text-[#FAFAFA] w-full hover:bg-[#27272A]"
              >
                Cancel
              </Button>
            </Link>
            <Alert className={`${alertW} bg-green-600 text-white border-none`}>
              <UploadIcon color="white" className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Marathon Uploaded Successfully
              </AlertDescription>
            </Alert>
            <Alert variant="destructive" className={`${alertL}`}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Error Occured, Please Try Again.
              </AlertDescription>
            </Alert>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Photographer;
