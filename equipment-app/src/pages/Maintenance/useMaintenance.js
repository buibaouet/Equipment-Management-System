import React from "react";

/**
 * useEquipmentList encapsulates data, filtering, sorting and pagination logic
 * so the UI component can remain presentational.
 * }}
 */
export default function useMaintenance() {
  const tableRowData = React.useMemo(
    () => [
      { id: 1, name: "Abram Schleifer", position: "Sales Assistant", location: "Edinburgh", age: 57, date: "25 Apr, 2027", salary: "$89,500" },
      { id: 2, name: "Charlotte Anderson", position: "Marketing Manager", location: "London", age: 42, date: "12 Mar, 2025", salary: "$105,000" },
      { id: 3, name: "Ethan Brown", position: "Software Engineer", location: "San Francisco", age: 30, date: "01 Jan, 2024", salary: "$120,000" },
      { id: 4, name: "Sophia Martinez", position: "Product Manager", location: "New York", age: 35, date: "15 Jun, 2026", salary: "$95,000" },
      { id: 5, name: "James Wilson", position: "Data Analyst", location: "Chicago", age: 28, date: "20 Sep, 2025", salary: "$80,000" },
      { id: 6, name: "Olivia Johnson", position: "HR Specialist", location: "Los Angeles", age: 40, date: "08 Nov, 2026", salary: "$75,000" },
      { id: 7, name: "William Smith", position: "Financial Analyst", location: "Seattle", age: 38, date: "03 Feb, 2026", salary: "$88,000" },
      { id: 8, name: "Isabella Davis", position: "UI/UX Designer", location: "Austin", age: 29, date: "18 Jul, 2025", salary: "$92,000" },
      { id: 9, name: "Liam Moore", position: "DevOps Engineer", location: "Boston", age: 33, date: "30 Oct, 2024", salary: "$115,000" },
      { id: 10, name: "Mia Garcia", position: "Content Strategist", location: "Denver", age: 27, date: "12 Dec, 2027", salary: "$70,000" }
    ],
    []
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(4);
  const [sortKey, setSortKey] = React.useState("name");
  const [sortOrder, setSortOrder] = React.useState("asc");

  const filteredAndSortedData = React.useMemo(() => {
    return tableRowData
      .sort((a, b) => {
        if (sortKey === "salary") {
          const salaryA = Number.parseInt(String(a[sortKey]).replace(/\$|,/g, ""));
          const salaryB = Number.parseInt(String(b[sortKey]).replace(/\$|,/g, ""));
          return sortOrder === "asc" ? salaryA - salaryB : salaryB - salaryA;
        }
        return sortOrder === "asc"
          ? String(a[sortKey]).localeCompare(String(b[sortKey]))
          : String(b[sortKey]).localeCompare(String(a[sortKey]));
      });
  }, [tableRowData, sortKey, sortOrder]);

  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  return {
    sortKey,
    sortOrder,
    handleSort,
    currentPage,
    handlePageChange,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    currentData
  };
}


