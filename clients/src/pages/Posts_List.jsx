
import { SortableTable } from "../componets/Table";

const Posts_List = () => {

  return (
    <section className="py-16">
      <div className="container">
        <div className="w-full flex justify-center items-center">
          <SortableTable />
        </div>
      </div>
    </section>
  );
};

export default Posts_List;
