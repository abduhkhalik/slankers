import { Typography } from "@material-tailwind/react";

export function Footer() {
  return (
    <footer className="flex pb-3 w-full flex-row flex-wrap items-center justify-center text-center md:justify-between">
      <div className="container">
        <Typography color="blue-gray" className="font-normal">
          &copy; 2024 <a href="https://abduhkhalik.vercel.app" target="_blank" className="text-blue-500 underline underline-offset-4" rel="noreferrer">AbduhKhalik</a>
        </Typography>
      </div>
    </footer>
  );
}
