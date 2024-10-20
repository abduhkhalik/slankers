import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";

const TABLE_HEAD = [
  "Nomor",
  "Nama Lengkap",
  "Kabupaten",
  "Kecamatan",
  "Kelurahan",
  // "Nomor KK",
  "Nomor KTP",
  "No RT",
  "No RW",
  "No TPS",
  "No HP",
  "Kordinator",
];

import { useReactToPrint } from "react-to-print";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
export function SortableTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [printPerPage] = useState(5000);
  const [isLoading, setIsLoading] = useState(false);
  const [TABLE_ROWS, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State untuk nilai pencarian
  const [searchTermInput, setSearchTermInput] = useState("");

  const handleExportCSV = () => {
    const header = Object.keys(TABLE_ROWS[0]);
    // Menyiapkan data
    const csvContent =
      "data:text/csv;charset=utf-8," +
      header.join(",") +
      "\n" +
      TABLE_ROWS.map((row) => header.map((key) => row[key]).join(",")).join(
        "\n"
      );

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Data Pemilih MAP",
    onAfterPrint: () => console("Printed PDF successfully!"),
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfLastPrint = currentPage * printPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const indexOfFirstPrint = indexOfLastItem - printPerPage;
  const currentItems = TABLE_ROWS.slice(indexOfFirstItem, indexOfLastItem);
  const currentPrint = TABLE_ROWS.slice(indexOfFirstPrint, indexOfLastPrint);

  const handleSearch = useCallback((data, searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filteredData = data.filter((row) =>
      Object.entries(row).some(
        ([key, value]) =>
          key !== "name" &&
          String(value).toLowerCase().includes(lowerCaseSearchTerm)
      )
    );

    filteredData.sort((a, b) => a.no_tps - b.no_tps);
    return filteredData;
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_KEY_URL}/posts`
        );
        const postData = res.data;
        setPosts(() => handleSearch(postData, searchTerm));
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [searchTerm, handleSearch]);

  const handleSearchInputChange = (event) => {
    setSearchTermInput(event.target.value);
  };

  const handleSearchButtonClick = () => {
    setSearchTerm(searchTermInput); // Setel searchTerm dengan nilai dari input pencarian
  };

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Data list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Melihat Hasil Input Data
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={handlePrint}
              >
                Print To PDF
              </Button>
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={handleExportCSV}
              >
                Download Ke CSV
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchTermInput}
                onChange={handleSearchInputChange}
              />
              <Button onClick={handleSearchButtonClick}>Search</Button>
            </div>
          </div>
          <Typography variant="paragraph" className="text-xs font-semibold">
            Tidak Bisa Mencari Berdasarkan Nama Lengkap
          </Typography>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}{" "}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUpDownIcon
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            {isLoading ? (
              <tbody className="flex justify-center items-center">
                <Typography
                  variant="h3"
                  color="blue-gray"
                  className="text-center animate-bounce"
                >
                  Loading ......
                </Typography>
              </tbody>
            ) : (
              <tbody>
                {currentItems.map(
                  (
                    {
                      _id,
                      name,
                      kabupaten,
                      kecamatan,
                      kelurahan,
                      // no_kk,
                      no_ktp,
                      no_rt,
                      no_rw,
                      no_tps,
                      no_hp,
                      simpul,
                    },
                    index
                  ) => {
                    const isLast = index === currentItems.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={name}>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {index + 1}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            {/* <Avatar src={img} alt={name} size="sm" /> */}
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {name}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {kabupaten}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {kecamatan}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {kelurahan}
                            </Typography>
                          </div>
                        </td>
                        {/* <td className={classes}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {no_kk}
                            </Typography>
                          </div>
                        </td> */}
                        <td className={classes}>
                          <div className="w-max">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70"
                            >
                              {no_ktp}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {no_rt}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {no_rw}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {no_tps}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {no_hp}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {simpul}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Edit Data">
                            <Link to={`/posts/${_id}`}>
                              <IconButton variant="text">
                                <PencilIcon className="h-4 w-4" />
                              </IconButton>
                            </Link>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            )}
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of {Math.ceil(TABLE_ROWS.length / itemsPerPage)}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(TABLE_ROWS.length / itemsPerPage)
                  )
                )
              }
              disabled={
                currentPage === Math.ceil(TABLE_ROWS.length / itemsPerPage)
              }
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      <table
        ref={componentRef}
        className="mt-4 w-full min-w-max table-auto text-left hidden print:block"
      >
        <thead>
          <tr>
            {TABLE_HEAD.map((head, index) => (
              <th
                key={head}
                className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                >
                  {head}{" "}
                  {index !== TABLE_HEAD.length - 1 && (
                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                  )}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        {isLoading ? (
          <tbody className="flex justify-center items-center">
            <Typography
              variant="h3"
              color="blue-gray"
              className="text-center animate-bounce"
            >
              Loading ......
            </Typography>
          </tbody>
        ) : (
          <tbody>
            {currentPrint.map(
              (
                {
                  name,
                  kabupaten,
                  kecamatan,
                  kelurahan,
                  // no_kk,
                  no_ktp,
                  no_rt,
                  no_rw,
                  no_tps,
                  no_hp,
                  simpul,
                },
                index
              ) => {
                const isLast = index === currentPrint.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={name}>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {index + 1}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {name}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {kabupaten}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {kecamatan}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {kelurahan}
                        </Typography>
                      </div>
                    </td>
                    {/* <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {no_kk}
                        </Typography>
                      </div>
                    </td> */}
                    <td className={classes}>
                      <div className="w-max">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70"
                        >
                          {no_ktp}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {no_rt}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {no_rw}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {no_tps}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {no_hp}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {simpul}
                      </Typography>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        )}
      </table>
    </>
  );
}
