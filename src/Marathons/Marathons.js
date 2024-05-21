import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import MarathonsJson from "../Marathons.json";
import { format } from "date-fns";
const Marathons = () => {
  const [value, setValue] = useState("")
  const sortedMarathons = [...MarathonsJson].sort((a, b) => new Date(b.Date) - new Date(a.Date));
  const [filteredMarathons, setFilteredMarathons] = useState(sortedMarathons);

    
  useEffect(() => {
    if (value === "") {
      setFilteredMarathons(sortedMarathons);
    } else {
      const filtered = sortedMarathons.filter((marathon) =>
        marathon.Name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMarathons(filtered);
    }
  }, [value]);
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
      <div className="flex flex-col px-[200px] w-full items-start gap-[10px]">
        <p className="text-[30px] text-[#FAFAFA] font-semibold">
          All Marathons
        </p>
        <p className="text-[16px] text-[#A1A1AA] font-normal">
          Check out all the marathons that have recently taken place!
        </p>
        <Input type="text" placeholder="Search for marathon’s name" value={value} onChange={(e) => setValue(e.target.value)} />
        <div className="w-full flex flex-col  gap-[15px]">
          {filteredMarathons.map((marathon) => (
            <Link to={`/marathons/${marathon.id}`}>
              <div className="w-full relative border-[1px] border-[#E4E4E7] p-[16px] rounded-[16px] flex flex-row justify-between items-center">
                <div className="flex flex-col gap-[15px]">
                  <p className="text-[24px] text-[#FAFAFA] font-semibold">
                    {marathon.Name} Marathon
                  </p>
                  <p className="text-[16px] text-[#A1A1AA] font-normal">
                  {marathon.Description}
                  </p>
                  <div className="flex gap-[8px] items-center">
                    <div className="flex gap-[10px] bg-[#212123] w-fit py-[6px] px-[10px] rounded-[999px] items-center">
                      <img
                        src={`${process.env.PUBLIC_URL}/images/test.png`}
                        className="w-[22px] h-[22px] object-cover rounded-[999px]"
                      ></img>
                      <p className="text-[#D3D3D3] text-[16px] font-medium">
                      {marathon.Photographer}
                      </p>
                    </div>
                    <div className="w-[4px] h-[4px] rounded-[50%] bg-[#71717A]"></div>
                    <p className="text-[#71717A] text-[16px] font-medium">
                    {format(marathon.Date,'dd MMMM yyyy')}
                    </p>
                  </div>
                  <div className="border-[1px] border-[#536471] w-fit rounded-[8px] text-[#D1D1DB] text-[16px] px-[10px] py-[6px]">
                    # {marathon.Distance} Km
                  </div>
                </div>
                <div className="w-[176px] h-[176px] rounded-[999px] relative">
                  <img
                    src={`${process.env.PUBLIC_URL}${marathon.Folder}/${marathon.Pictures[0]}`}
                    className="w-[176px] h-[176px] rounded-[999px] object-cover"
                  ></img>
                  <div className="absolute left-0 bottom-0 flex w-full h-full flex-col items-center justify-center bg-[#00000062] rounded-[999px]">
                    <p className="text-[24px] font-semibold text-white">+{marathon.Pictures.length}</p>
                    <p className="text-[16px] font-semibold text-white">
                      Pictures
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marathons;
