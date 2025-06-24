import { useEffect, useState } from "react";
import axios from "axios";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showTimePipe, setShowTimePipe] = useState(false);

  // Determine which server to use based on environment
  const baseURL = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_SERVER_URL
    : import.meta.env.VITE_PROD_SERVER_URL;

  // Fetch transactions from the backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/transactions/list`);
        setTransactions(response.data);
        setFilteredTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [baseURL]);

  // Calculate time difference between two createDate strings
  const calculateTimeDifference = (date1, date2) => {
    const diff = Math.abs(new Date(date2) - new Date(date1)); // Difference in milliseconds
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle search and filter functionality
  useEffect(() => {
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm === "") {
      // Reset to show all transactions if search box is empty
      setFilteredTransactions(transactions);
      setShowTimePipe(false); // Hide Time Pipe Result column
    } else {
      // Filter transactions based on search term
      const filtered = transactions.filter((transaction) =>
        transaction.username
          .toLowerCase()
          .includes(trimmedSearchTerm.toLowerCase())
      );
      setFilteredTransactions(filtered);
      setShowTimePipe(filtered.length > 0); // Only show Time Pipe Result if matches are found
    }
  }, [searchTerm, transactions]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Transactions Table
      </h1>
      <div className="flex items-center justify-center mb-4">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-l px-4 py-2 w-full focus:outline-none max-w-md"
        />
      </div>
      <div className="overflow-x-auto m-40 mt-0">
        <table className="min-w-full table-auto border-collapse border border-gray-200 mx-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Username
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Amount
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Time
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Created Date
              </th>
              {showTimePipe && (
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Time Pipe Result
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {transaction.username}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {transaction.amount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {transaction.time}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {new Date(transaction.createDate).toLocaleString()}
                  </td>
                  {showTimePipe && (
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {index < filteredTransactions.length - 1
                        ? calculateTimeDifference(
                            transaction.createDate,
                            filteredTransactions[index + 1].createDate
                          )
                        : "--"}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showTimePipe ? 5 : 4}
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No transactions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
