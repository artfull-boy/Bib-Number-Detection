import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import _ from "lodash";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../components/ui/dialog";
import { Download } from "lucide-react";
import marathonData from "../Marathons.json";
import BibNumbers from "../bib_numbers.json"
const Marathon = () => {
  const { id } = useParams();
  const marathonFiltered = marathonData.filter(
    (marathon) => marathon.id == id
  )[0];
  const [bibNumber, setBibNumber] = useState("");
  const [foundImages, setFoundImages] = useState([]);
  useEffect(() => {
    if(bibNumber == "") {
        setFoundImages(marathonFiltered.Pictures)
    }
    else {
        const sameMarathon = BibNumbers.filter(file => file.Marathon_name == marathonFiltered.Name)
        const FilteredImages = sameMarathon.filter(file => file.bib_numbers.find(bib => bib.startsWith(bibNumber)))
        const FinalImages = FilteredImages.map(item => item.filename)
        setFoundImages(FinalImages)
    }
  },[bibNumber])


  return (
    <div className="w-full flex flex-col gap-20 justify-center items-center pb-32">
      <div className="navbar flex w-full justify-between px-9 py-[20px]">
      <Link to={'/'}>
        <img
          src={`${process.env.PUBLIC_URL}/images/logo.png`}
          className="w-[154px]"
        ></img>
        </Link>
        <Link to={"/login"}>
          <Button className=" w-[90px] bg-[#FAFAFA] text-[#09090B] hover:bg-[#FAFAFA] hover:text-[#09090B]">
            Sign In
          </Button>
        </Link>
      </div>
      <div className="flex flex-col px-[200px] w-full items-start gap-[15px]">
        <Link to={"/marathons"} className="flex justify-start w-fit">
          <div className="flex items-center justify-start w-full border-[1px] border-[#3F3F46] px-[16px] py-[8px] rounded-[10px]">
            <img
              src={`${process.env.PUBLIC_URL}/images/left.png`}
              className="w-[20px] h-[20px]"
              alt="Back"
            />
            <p className="text-[#FAFAFA] text-[16px] font-medium leading-[24px]">
              Back to Marathons
            </p>
          </div>
        </Link>
        <div className="w-full flex flex-col gap-[15px]">
          <div className="w-full relative border-[1px] border-[#3F3F46] p-[16px] rounded-[16px] flex flex-row justify-between items-center">
            <div className="flex flex-col gap-[15px]">
              <p className="text-[24px] text-[#FAFAFA] font-semibold">
                {marathonFiltered.Name} Marathon
              </p>
              <p className="text-[16px] text-[#A1A1AA] font-normal">
                {marathonFiltered.Description}
              </p>
              <div className="flex gap-[8px] items-center">
                <div className="flex gap-[10px] bg-[#212123] w-fit py-[6px] px-[10px] rounded-[999px] items-center">
                <img
                        src={`${process.env.PUBLIC_URL}/images/test.png`}
                        className="w-[22px] h-[22px] object-cover rounded-[999px]"
                      ></img>
                  <p className="text-[#D3D3D3] text-[16px] font-medium">
                    {marathonFiltered.Photographer}
                  </p>
                </div>
                <div className="w-[4px] h-[4px] rounded-[50%] bg-[#71717A]"></div>
                <p className="text-[#71717A] text-[16px] font-medium">
                  {marathonFiltered.Date}
                </p>
              </div>
              <div className="border-[1px] border-[#536471] w-fit rounded-[8px] text-[#D1D1DB] text-[16px] px-[10px] py-[6px]">
                # {marathonFiltered.Distance} Km
              </div>
            </div>
            <div className="w-[176px] h-[176px] rounded-[999px] relative">
              <img
                src={`${process.env.PUBLIC_URL}${marathonFiltered.Folder}/${marathonFiltered.Pictures[0]}`}
                className="w-[176px] h-[176px] rounded-[999px] object-cover"
                alt="Marathon"
              />
              <div className="absolute left-0 bottom-0 flex w-full h-full flex-col items-center justify-center bg-[#00000062] rounded-[999px]">
                <p className="text-[24px] font-semibold text-white">
                  +{marathonFiltered.Pictures.length}
                </p>
                <p className="text-[16px] font-semibold text-white">Pictures</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center rounded-[6px] border-[1px] border-[#3F3F46] w-full h-[54px] px-[8px] py-[4px]">
          <div className="flex justify-center items-center bg-[#27272A] rounded-[6px] py-[6px] px-[12px] text-white text-[14px] font-medium">
            🖼️ Pictures
          </div>
          <Input
            type="number"
            placeholder="Search by Bib Number"
            className="w-[400px]"
            value={bibNumber}
            onChange={(e) => setBibNumber(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-[15px] justify-center rounded-[6px] border-[1px] border-[#3F3F46] w-full py-10">
          {foundImages.map((imageUrl, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <img
                  src={`${process.env.PUBLIC_URL}${marathonFiltered.Folder}/${imageUrl}`}
                  alt={`Marathon ${marathonFiltered.Name}`}
                  className="w-[180px] h-[180px] object-cover rounded-lg"
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-[#090909]">
                <img
                  src={`${process.env.PUBLIC_URL}${marathonFiltered.Folder}/${imageUrl}`}
                  alt={`Marathon ${marathonFiltered.Name}`}
                  className="w-[600px] h-[600px] object-cover rounded-lg"
                />
                <DialogFooter className="sm:justify-start ">
                  <DialogClose asChild>
                    <a href={`${process.env.PUBLIC_URL}${marathonFiltered.Folder}/${imageUrl}`} download={`${process.env.PUBLIC_URL}${marathonFiltered.Folder}/${imageUrl}`}>
                      <Button
                        type="button"
                        variant="secondary"
                        className="flex gap-[12px]"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marathon;
