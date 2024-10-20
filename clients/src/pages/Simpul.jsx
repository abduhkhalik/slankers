import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Button } from "@material-tailwind/react";

function Simpul() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_KEY_URL}/posts`
        );
        setData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const uniqueData = data.reduce((acc, curr) => {
    const simpul = curr.simpul.toUpperCase();
    if (!acc.includes(simpul)) {
      acc.push(simpul);
    }
    return acc;
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = uniqueData.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <section className="mb-5">
      <div className="container">
        <Typography
          variant="h3"
          color="blue-gray"
          className="text-center uppercase"
        >
          List Simpul Slankers
        </Typography>
        <div className="w-full flex justify-center py-5 items-center">
          <table className="bg-white max-w-lg py-2 border border-solid border-black">
            <thead>
              <tr className="flex justify-center items-center gap-5 border border-solid">
                <th className="text-center">NOMOR</th>
                <th className="text-center">NAMA Kordinator</th>
              </tr>
            </thead>
            {isLoading ? (
              <Typography
                variant="lead"
                color="blue-gray"
                className="animate-bounce"
              >
                Loading ......
              </Typography>
            ) : (
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={index}
                    className="flex items-center border border-solid"
                  >
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td className="ml-20">{item}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <div className="flex justify-center gap-5 mt-5">
          <Button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={indexOfLastItem >= uniqueData.length}
            className=""
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Simpul;
