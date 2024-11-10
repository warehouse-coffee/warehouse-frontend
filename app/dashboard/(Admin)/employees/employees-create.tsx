import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Storage {
  id: number;
  name: string;
  status: "Active" | "Inactive" | "UnderMaintenance";
}

export default function EmployeesCreatePage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedStorages, setSelectedStorages] = React.useState<number[]>([]);

  const storages: Storage[] = [
    { id: 1, name: "Coffee Trung Nguyen 1", status: "Active" },
    { id: 2, name: "Tea House 1", status: "Active" },
    { id: 3, name: "Bakery Shop 1", status: "Inactive" },
    { id: 4, name: "Coffee Trung Nguyen 2", status: "UnderMaintenance" },
    { id: 5, name: "Tea House 2", status: "Active" },
    { id: 6, name: "Bakery Shop 2", status: "Inactive" },
    { id: 7, name: "Coffee Trung Nguyen 3", status: "Active" },
    { id: 8, name: "Tea House 3", status: "UnderMaintenance" },
    { id: 9, name: "Bakery Shop 3", status: "Active" },
  ];

  const filteredStorages = storages.filter((storage) =>
    storage.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredStorages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStorages = filteredStorages.slice(startIndex, endIndex);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      userName: formData.get("username"),
      password: formData.get("password"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
      warehouses: selectedStorages,
    };
    console.log(data);
  };

  const getStatusColor = (status: Storage["status"]) => {
    switch (status) {
      case "Active":
        return "text-green-500";
      case "Inactive":
        return "text-red-500";
      case "UnderMaintenance":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Information Section */}
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">User Information</h2>

              <div>
                <Label htmlFor="username" className="block mb-1">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  required
                  placeholder="Enter username"
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="password" className="block mb-1">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter password"
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="email" className="block mb-1">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter email"
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="block mb-1">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  className="w-full"
                />
              </div>
            </div>

            {/* Storages Section */}
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Storages</h2>

              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search storages..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="max-h-[220px] overflow-y-auto">
                  {currentStorages.map((storage) => (
                    <div
                      key={storage.id}
                      className="flex items-center justify-between p-2 hover:bg-muted even:bg-gray-50"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`storage-${storage.id}`}
                          checked={selectedStorages.includes(storage.id)}
                          onCheckedChange={(checked: any) => {
                            if (checked) {
                              setSelectedStorages([
                                ...selectedStorages,
                                storage.id,
                              ]);
                            } else {
                              setSelectedStorages(
                                selectedStorages.filter(
                                  (id) => id !== storage.id
                                )
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`storage-${storage.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {storage.name}
                        </label>
                      </div>
                      <span
                        className={`text-sm ${getStatusColor(storage.status)}`}
                      >
                        {storage.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="bg-primary text-primary-foreground"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
