import { Customer } from "@/data/mockData";

export const exportToExcel = (customers: Customer[]) => {
  const headers = ["Name", "Consumer Number", "Mobile", "Address", "System Capacity (kW)", "Order Amount (₹)", "Order Date"];
  
  let csvContent = headers.join(",") + "\n";
  
  customers.forEach((customer) => {
    const row = [
      customer.name,
      customer.consumerNumber,
      customer.mobile,
      `"${customer.address}"`,
      customer.systemCapacity,
      customer.orderAmount,
      customer.orderDate,
    ];
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `customers_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportCustomerReport = (customer: Customer) => {
  const reportData = `
SOLAR PROJECT TRACKING SYSTEM
Customer Report
Generated: ${new Date().toLocaleString()}

=================================
CUSTOMER INFORMATION
=================================
Name: ${customer.name}
Consumer Number: ${customer.consumerNumber}
Mobile: ${customer.mobile}
Address: ${customer.address}
System Capacity: ${customer.systemCapacity} kW
Order Amount: ₹${customer.orderAmount.toLocaleString()}
Order Date: ${new Date(customer.orderDate).toLocaleDateString()}

=================================
`;

  const blob = new Blob([reportData], { type: "text/plain;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${customer.name.replace(/\s+/g, "_")}_report.txt`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
