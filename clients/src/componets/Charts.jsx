import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import axios from "axios";

export function ChartsBar() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_KEY_URL}/posts`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const processData = (data) => {
    const kelurahanCounts = data.reduce((acc, { kelurahan }) => {
      if (isNaN(kelurahan)) { // Check if kelurahan is not a number
        acc[kelurahan] = (acc[kelurahan] || 0) + 1;
      }
      return acc;
    }, {});

    const dataByKecamatan = data.reduce((acc, item) => {
      const { kecamatan, kelurahan, votes } = item;
      if (isNaN(kelurahan)) { // Check if kelurahan is not a number
        const voteCount = votes || 1; // Ensure votes is at least 1 if undefined
        if (!acc[kecamatan]) {
          acc[kecamatan] = { totalVotes: 0, kelurahanCounts: {} };
        }
        acc[kecamatan].totalVotes += voteCount;
        acc[kecamatan].kelurahanCounts[kelurahan] = (acc[kecamatan].kelurahanCounts[kelurahan] || 0) + voteCount;
      }
      return acc;
    }, {});

    const dataByKecamatanArray = Object.entries(dataByKecamatan).map(([kecamatan, { totalVotes, kelurahanCounts }]) => ({
      kecamatan,
      totalVotes,
      kelurahanData: Object.entries(kelurahanCounts).filter(([kelurahan]) => isNaN(kelurahan)).map(([kelurahan, value]) => ({ kelurahan, value })),
    }));

    return { kelurahanCounts, dataByKecamatanArray };
  };

  const { kelurahanCounts, dataByKecamatanArray } = processData(data);

  const chartConfig = {
    type: "bar",
    height: 240,
    series: [{ name: "Data", data: Object.values(kelurahanCounts) }],
    options: {
      chart: { toolbar: { show: false } },
      title: { text: "", show: false }, // Corrected to properly hide the title
      dataLabels: { enabled: false },
      colors: ["#070FB7"],
      plotOptions: { bar: { columnWidth: "40%", borderRadius: 2 } },
      xaxis: {
        axisTicks: { show: false },
        axisBorder: { show: false },
        labels: { style: { colors: "#616161", fontSize: "12px", fontFamily: "inherit", fontWeight: 400 } },
        categories: Object.keys(kelurahanCounts),
      },
      yaxis: { labels: { style: { colors: "#616161", fontSize: "12px", fontFamily: "inherit", fontWeight: 400 } } },
      grid: { show: true, borderColor: "#dddddd", strokeDashArray: 5, xaxis: { lines: { show: true } }, padding: { top: 5, right: 20 } },
      fill: { opacity: 0.8 },
      tooltip: { theme: "dark" },
    },
  };

  let grandTotalVotes = dataByKecamatanArray.reduce((acc, { totalVotes }) => acc + totalVotes, 0);

  return (
    <>
      <Card>
        <CardHeader floated={false} shadow={false} color="transparent" className="flex flex-col gap-4 rounded-none md:flex-row md:items-center">
          <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
            <Square3Stack3DIcon className="h-6 w-6" />
          </div>
          <div>
            <Typography variant="h6" color="blue-gray">Bar Chart</Typography>
            <Typography variant="small" color="gray" className="max-w-sm font-normal">Grafik Data Penginputan</Typography>
          </div>
        </CardHeader>
        <CardBody className="px-2 pb-0">
          <Chart {...chartConfig} />
        </CardBody>
      </Card>
      <div className="flex justify-center mt-10 items-center">
        <div className="relative overflow-x-auto w-full">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Nama Kecamatan</th>
                <th scope="col" className="px-6 py-3">Nama kelurahan</th>
                <th scope="col" className="px-6 py-3">Jumlah Suara / kelurahan</th>
                <th scope="col" className="px-6 py-3">Total Suara / Kecamatan</th>
              </tr>
            </thead>
            {dataByKecamatanArray.map((kecamatan, kecamatanIndex) => (
              <React.Fragment key={kecamatanIndex}>
                {kecamatan.kelurahanData.map((kelurahan, kelurahanIndex) => (
                  <tr key={kelurahanIndex} className="bg-white border-b">
                    {kelurahanIndex === 0 && <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap" rowSpan={kecamatan.kelurahanData.length}>{kecamatan.kecamatan}</td>}
                    <td className="px-6 py-4">{kelurahan.kelurahan}</td>
                    <td className="px-6 py-4">{kelurahan.value}</td>
                    {kelurahanIndex === 0 && <td className="px-6 py-4" rowSpan={kecamatan.kelurahanData.length}>{kecamatan.totalVotes}</td>}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </table>
        </div>
      </div>
      <div className="bg-white flex items-center">
        <p className="ml-5 font-bold">Total Suara Keseluruhan :</p>
        <p className="mr-5">{grandTotalVotes}</p>
      </div>
    </>
  );
}
