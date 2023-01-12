import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");

  const handleNext = () => {
    setStep(step + 1);
  };
  const steps = [
    <Phone key={1} next={handleNext} phone={phone} setPhone={setPhone} />,
    <Record key={2} next={handleNext} phone={phone} />,
  ];
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border rounded w-full lg:w-3/4 xl:w-2/4 p-5 shadow-lg">
        {steps[step]}
      </div>
    </div>
  );
}

const Phone = ({
  next,
  phone,
  setPhone,
}: {
  next: () => void;
  phone: string;
  setPhone: (e: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [phoneBtn, setPhoneBtn] = useState("Check");

  const handlePhoneSubmit = () => {
    if (phoneBtn === "Next") {
      next();
      return;
    } else {
      setLoading(true);
      setTimeout(() => {
        setPhoneBtn("Next");
        setLoading(false);
      }, 2000);
    }
  };
  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Phone number
      </label>
      <input
        placeholder="08130813007"
        name="phone"
        className="border rounded p-3 w-full"
        onChange={(e) => setPhone(e.target.value)}
        value={phone}
      />
      {phoneBtn === "Next" && (
        <div className="mt-1.5 text-green-600">Available</div>
      )}
      <button
        onClick={handlePhoneSubmit}
        className="bg-blue-700 text-white py-2 px-5 mt-3 w-full rounded"
      >
        {loading ? "Loading..." : phoneBtn}
      </button>
    </div>
  );
};

const Record = ({ next, phone }: { next: () => void; phone: string }) => {
  const handleSubmit = () => {};
  return (
    <div>
      <h2>{phone} is available for record creation</h2>
      <button
        onClick={handleSubmit}
        className="bg-blue-700 text-white py-2 px-5 mt-3 w-full rounded"
      >
        Create Record
      </button>
    </div>
  );
};
