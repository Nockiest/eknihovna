import Image from "next/image";
// import { useQuery } from "@/app/context";

type AutocompleteSearchBarParamas = {};
const SearchBar: React.FC<AutocompleteSearchBarParamas> = () => {
//   const { query, setQuery } = useQuery();

  return (
    <div
      style={{
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        width: "300px",
        display: "flex",
        justifyContent: "start",
        gap: "0.5em",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Image src="icon/search.svg" alt='search' width={32} height={32} className="m-1" />
      <input
        type="text"
        // value={query}
        // onChange={(e) => setQuery(e.target.value)}
        style={{
          border: "none",
          // zIndex: 1,
          width: "100%",
        }}
      />
    </div>
  );
};

export default SearchBar;
