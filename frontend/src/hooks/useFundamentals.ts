import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFundamentals = (symbol: string | null) => {
  const [fundamentals, setFundamentals] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
      setFundamentals(null);
      return;
    }

    const fetchFundamentals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/companies/${symbol}/fundamentals`);
        setFundamentals(response.data);
      } catch (err) {
        console.error("Error fetching fundamentals:", err);
        setError("Failed to fetch fundamentals");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFundamentals();
  }, [symbol]);

  return { fundamentals, isLoading, error };
};
