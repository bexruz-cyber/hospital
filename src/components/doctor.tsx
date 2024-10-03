import { Button } from './ui/button';
import { Dialog } from '@headlessui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from '@/hooks/use-toast';

interface Spec {
  _id: string;
  title: string;
}

interface Department {
  _id: string;
  title: string;
}

interface Doctor {
  _id: string;
  name: string;
  phone: string;
  spec: string;
  department: string;
  gender: string;
  region: string;
  district: string;
  education: string;
  family: number;
  familyphone: string;
  worktime: number;
  birthday: number;
}

const API_URL = 'http://195.158.9.124:4109'; // API URL

export default function DoctorForm() {
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [selectedSpecId, setSelectedSpecId] = useState<string>('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [gender, setGender] = useState<number>(1);
  const [birthday, setBirthday] = useState<string>('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [family, setFamily] = useState<number>(3);
  const [familyPhone, setFamilyPhone] = useState<string>('');
  const [workTime, setWorkTime] = useState<number>(3);
  const [region, setRegion] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [education, setEducation] = useState<string>('');

  const getAuthToken = () => localStorage.getItem('authToken');

  const fetchData = async (url: string) => {
    const authToken = getAuthToken();
    if (!authToken) {
      throw new Error('Authorization token not found');
    }

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  };

  useEffect(() => {
    const fetchSpecsAndDepartments = async () => {
      try {
        const specsData = await fetchData(`${API_URL}/spec`);
        console.log("Specs data:", specsData);
        setSpecs(specsData);

        const departmentsData = await fetchData(`${API_URL}/department`);
        console.log("Departments data:", departmentsData);
        setDepartments(departmentsData);

        const doctorsData = await fetchData(`${API_URL}/doctor`);
        console.log("Doctors data:", doctorsData);
        setDoctors(doctorsData);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecsAndDepartments();
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();

    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authorization token not found');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/doctor`, {
        name,
        phone,
        spec: selectedSpecId,
        department: selectedDepartmentId,
        gender,
        birthday,
        avatar,
        family,
        familyPhone,
        workTime,
        region,
        district,
        education,
      },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      console.log("Add Doctor Response:", response.data); // Log the response

      // Refresh doctor list after adding
      const updatedDoctors = await fetchData(`${API_URL}/doctor`);
      setDoctors(updatedDoctors);
      resetForm(); // Clear form after submission
      toast({
        title: "Doctor add successfully",
      });
    } catch (error: any) {
      console.error("Error adding doctor:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authorization token not found');
      return;
    }

    try {
      await axios.delete(`${API_URL}/doctor/${id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      console.log("Doctor delete successfully");

      // Refresh doctor list after deletion
      const updatedDoctors = await fetchData(`${API_URL}/doctor`);
      setDoctors(updatedDoctors);
      toast({
        title: "Doctor delet successfully",
      });
    } catch (error: any) {
      console.error("Error deleting doctor:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setSelectedSpecId('');
    setSelectedDepartmentId('');
    setGender(1);
    setBirthday('');
    setAvatar(null);
    setFamily(3);
    setFamilyPhone('');
    setWorkTime(3);
    setRegion('');
    setDistrict('');
    setEducation('');
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold">Doctors</h2>
        <Button className="bg-blue-600 text-white" onClick={() => setIsModalOpen(true)}>Add Doctor</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="border border-gray-300 rounded p-4">
            <div className="grid grid-cols-2 gap-1 mb-4">
              <h3 className='text-xl font-medium'>name: {doctor.name}</h3>
              <p className='text-xl font-medium'>phone: {doctor.phone}</p>
              <p className='text-xl font-medium'>spec: {doctor.spec}</p>
              <p className='text-xl font-medium'>department: {doctor.department}</p>
              <p className='text-xl font-medium'>gender time: {doctor.gender}</p>
              <p className='text-xl font-medium'>region: {doctor.region}</p>
              <p className='text-xl font-medium'>district: {doctor.district}</p>
              <p className='text-xl font-medium'>education: {doctor.education}</p>
              <p className='text-xl font-medium'>family: {doctor.family}</p>
              <p className='text-xl font-medium'>familyphone: {doctor.familyphone}</p>
              <p className='text-xl font-medium'>worktime: {doctor.worktime}</p>
              <p className='text-xl font-medium'>birthday: {doctor.birthday}</p>
            </div>
            <div className="flex items-center justify-between">
              <button className="text-2xl  text-black hover:opacity-50 transition-all duration-300 ">
                <FaEdit />
              </button>
              <button className="text-2xl text-black hover:opacity-50 transition-all duration-300" onClick={() => handleDeleteDoctor(doctor._id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={isModalOpen} onClose={resetForm}>
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded p-6 w-2/3">
            <Dialog.Title>Add Doctor</Dialog.Title>
            <form onSubmit={handleAddDoctor} className='max-h-[600px] grid grid-cols-2 gap-5 overflow-y-auto'>
              <div>
                <label className='mb-1 block'>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div>
                <label className='mb-1 block'>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div>
                <label className='mb-1 block'>Spec</label>
                <select
                  value={selectedSpecId}
                  onChange={(e) => setSelectedSpecId(e.target.value)}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="">Select Spec</option>
                  {specs.map((spec) => (
                    <option key={spec._id} value={spec._id}>
                      {spec.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='mb-1 block'>Department</label>
                <select
                  value={selectedDepartmentId}
                  onChange={(e) => setSelectedDepartmentId(e.target.value)}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='mb-1 block'>Gender</label>
                <select
                  value={gender.toString()}
                  onChange={(e) => setGender(Number(e.target.value))}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                >
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                </select>
              </div>
              <div>
                <label className='mb-1 block'>Birthday</label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div>
                <label className='mb-1 block'>Family</label>
                <input
                  type="number"
                  value={family}
                  onChange={(e) => setFamily(Number(e.target.value))}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div>
                <label className='mb-1 block'>Family Phone</label>
                <input
                  type="text"
                  value={familyPhone}
                  onChange={(e) => setFamilyPhone(e.target.value)}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div>
                <label className='mb-1 block'>Work Time</label>
                <input
                  type="number"
                  value={workTime}
                  onChange={(e) => setWorkTime(Number(e.target.value))}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div>
                <label className='mb-1 block'>Region</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div>
                <label className='mb-1 block'>District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div>
                <label className='mb-1 block'>Education</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <Button type="submit" className="bg-blue-600 text-white mr-auto p-4">Add Doctor</Button>
              <Button onClick={resetForm} className="bg-gray-300 ml-auto p-4">Cancel</Button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
