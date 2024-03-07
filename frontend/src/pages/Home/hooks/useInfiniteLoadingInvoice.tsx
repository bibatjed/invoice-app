import { useCallback, useEffect, useRef, useState } from "react";
import { GetInvoicesType, InvoiceItem, getInvoices } from "../api/invoice";

export default function useInfiniteLoadingInvoice() {
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<GetInvoicesType>({
    result: [],
    pages: 0,
    count: 0,
  });

  const [statusFilter, setStatusFilter] = useState("");

  const currentPage = useRef(1);

  const bottom = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setIsLoading(true);
    getInvoices(statusFilter)
      .then((data) => {
        setData(data);
      })
      .finally(() => setIsLoading(false));

    return () => {
      currentPage.current = 1;
    };
  }, [statusFilter]);

  const postInvoiceData = useCallback(
    (data: InvoiceItem) => {
      if (statusFilter.length === 0 || statusFilter.includes(data.status)) {
        setData((prevData) => ({
          ...prevData,
          count: prevData.count + 1,
          result: [data, ...prevData.result],
        }));
      }
    },
    [statusFilter]
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading && data.pages >= currentPage.current + 1) {
        setIsLoading(true);
        getInvoices(statusFilter, ++currentPage.current)
          .then((data) => {
            setData((prev) => ({ ...prev, result: [...prev.result, ...data.result] }));
          })
          .finally(() => setIsLoading(false));
      }
    });
    if (bottom.current) {
      observer.observe(bottom.current);
    }

    return () => {
      if (bottom.current) {
        observer.unobserve(bottom.current);
      }
    };
  }, [data.count, isLoading, statusFilter]);

  return { bottomRef: bottom, data, isLoading, setStatusFilter, postInvoiceData };
}
