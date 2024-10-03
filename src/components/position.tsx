import { useEffect, useState } from 'react';
import { Button } from './ui/button'; // Importing Button from Shadcn
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons
import axios from 'axios'; // Importing axios
import { toast } from '@/hooks/use-toast';

export default function Position() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [newDepartmentTitle, setNewDepartmentTitle] = useState<string>('');
  const [editDepartmentId, setEditDepartmentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      const authToken = localStorage.getItem('authToken');

      try {
        const response = await axios.get('http://195.158.9.124:4109/position', {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        setDepartments(response.data); // Set the fetched departments data
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleEdit = (id: string, title: string) => {
    setEditDepartmentId(id);
    setNewDepartmentTitle(title);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://195.158.9.124:4109/position/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      toast({
        title: "Position delete successfully",
      });
      setDepartments((prev) => prev.filter((dept) => dept._id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddDepartment = async () => {
    const authToken = localStorage.getItem('authToken');

    try {
      const response = await axios.post('http://195.158.9.124:4109/position', {
        title: newDepartmentTitle,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      setDepartments((prev) => [...prev, response.data]);
      setNewDepartmentTitle('');
      setIsModalOpen(false);
      toast({
        title: "Position add successfully",
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateDepartment = async () => {
    const authToken = localStorage.getItem('authToken');

    if (!editDepartmentId) {
      setError('Department ID is required for update.');
      return;
    }

    try {
      const response = await axios.put(`http://195.158.9.124:4109/position`, {
        _id: editDepartmentId,
        title: newDepartmentTitle,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Check the response data to ensure the update was successful
      if (response.data) {
        setDepartments((prev) =>
          prev.map((dept) =>
            dept._id === editDepartmentId ? { ...dept, title: newDepartmentTitle } : dept
          )
        );
        setNewDepartmentTitle(''); // Clear the input after update
        setIsEditModalOpen(false);  // Close the modal
        setEditDepartmentId(null);   // Reset the ID
        toast({
          title: "Position edited successfully",
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update department.');
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Departments</h1>
        <Button className="bg-blue-600 text-white" onClick={toggleModal}>Add Department</Button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead className="text-gray-600">
            <tr>
              <th className="py-3 px-5 text-left">Title</th>
              <th className="py-3 px-5 text-left">Status</th>
              <th className="py-3 px-5 text-left">Created Time</th>
              <th className="py-3 px-5 text-left">User ID</th>
              <th className="py-3 px-5 text-left">ID</th>
              <th className="py-3 px-5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-5">{department.title}</td>
                <td className="py-3 px-5">{department.status}</td>
                <td className="py-3 px-5">{new Date(department.createdTime).toLocaleString()}</td>
                <td className="py-3 px-5">{department.userId}</td>
                <td className="py-3 px-5">{department._id}</td>
                <td className="py-3 px-5 flex space-x-2">
                  <button
                    onClick={() => handleEdit(department._id, department.title)}
                    className="text-black hover:opacity-50 transition-all duration-300"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(department._id)}
                    className="text-black hover:opacity-50 transition-all duration-300"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Modal for Adding New Department */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Add New Department</h2>
            <input
              type="text"
              value={newDepartmentTitle}
              onChange={(e) => setNewDepartmentTitle(e.target.value)}
              placeholder="Enter department title"
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end">
              <Button className="bg-blue-600 text-white" onClick={handleAddDepartment}>
                Add Department
              </Button>
              <Button className="ml-2" onClick={toggleModal}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Editing Department */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Edit Department</h2>
            <input
              type="text"
              value={newDepartmentTitle}
              onChange={(e) => setNewDepartmentTitle(e.target.value)}
              placeholder="Enter new department title"
              className="border border-gray-300 p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end">
              <Button className="bg-blue-600 text-white" onClick={handleUpdateDepartment}>
                Update Department
              </Button>
              <Button className="ml-2" onClick={toggleEditModal}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
