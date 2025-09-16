import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { glossaryData } from "@/data/education-center-data";

const filterItems = [
  { label: "All", value: "all" },
  { label: "Technology", value: "technology" },
  { label: "Finance", value: "finance" },
  { label: "Digital Assets", value: "digital-assets" },
  { label: "Transactions", value: "transactions" },
  { label: "Security", value: "security" },
  { label: "Wallets", value: "wallets" },
  { label: "Concepts", value: "concepts" },
  { label: "DeFi", value: "defi" },
];

function CryptoGlossary() {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const renderedGlossaryData = glossaryData.filter((item) => {
    return (
      (item.term.toLowerCase().includes(search.toLowerCase()) ||
        item.definition.toLowerCase().includes(search.toLowerCase())) &&
      (selectedFilter === "all" || item.category === selectedFilter)
    );
  });
  return (
    <div className="space-y-5">
      <section className="flex gap-4 max-md:flex-col md:items-start justify-between">
        <label className="relative flex flex-1 min-w-sm md:max-w-md items-center">
          <Search className="absolute left-3 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search terms or definitions..."
            className="pl-10 bg-gray-900/50 border-gray-800 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <Filters
          filters={filterItems}
          value={selectedFilter}
          onSelect={(value) => setSelectedFilter(value)}
        />
      </section>

      <section>
        <div className="grid gap-4">
          {renderedGlossaryData.map((item, index) => (
            <GlossaryItem key={index} item={item} />
          ))}
          {/* emmpty state */}
          {renderedGlossaryData.length === 0 && (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-400">No results found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

type FiltersProps = {
  filters: {
    label: string;
    value: string;
  }[];
  value: string;
  onSelect: (value: string) => void;
};

const Filters = ({ filters, value, onSelect }: FiltersProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          className={`border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-gray-300 cursor-pointer
          ${value === filter.value && "bg-white text-black hover:bg-white/80"}`}
          onClick={() => onSelect(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

const GlossaryItem = ({ item }: { item: (typeof glossaryData)[number] }) => {
  const categoryName =
    filterItems.find((filter) => filter.value === item.category)?.label ||
    "unknown category";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="bg-[#13182A] backdrop-blur-md border-[1px] border-[#374151]
      rounded-lg p-4 space-y-4"
    >
      <div className="flex justify-between">
        <h1 className="text-base font-semibold text-white">{item.term}</h1>
        <span className="border border-white/30 text-white/80 rounded-full px-2 py-0.5 text-xs capitalize">
          {categoryName}
        </span>
      </div>
      <p className="text-sm font-medium text-white/70">{item.definition}</p>
    </motion.div>
  );
};

export { CryptoGlossary };
export default CryptoGlossary;
