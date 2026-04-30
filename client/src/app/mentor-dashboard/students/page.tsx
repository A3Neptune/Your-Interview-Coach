"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Mail,
  Phone,
  Award,
  Trash2,
  Edit2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import EditStudentModal from "@/components/EditStudentModal";
import AddStudentModal from "@/components/AddStudentModal";

type SessionTypeKey =
  | "all"
  | "resumeAnalysis"
  | "mockInterview"
  | "liveWebinar"
  | "gdGroupDiscussions"
  | "other";

const makeSessionTypeCounter = (): Record<SessionTypeKey, number> => ({
  all: 0,
  resumeAnalysis: 0,
  mockInterview: 0,
  liveWebinar: 0,
  gdGroupDiscussions: 0,
  other: 0,
});

const normalizeSessionType = (sessionType?: string): SessionTypeKey => {
  const value = (sessionType || "").trim();
  if (
    ["resumeAnalysis", "resume-analysis", "cvReview", "resumeReview"].includes(
      value,
    )
  )
    return "resumeAnalysis";
  if (
    [
      "oneMentorship",
      "mockInterview",
      "mock-interview",
      "interviewPrep",
    ].includes(value)
  )
    return "mockInterview";
  if (["webinars", "liveWebinar", "live-webinar"].includes(value))
    return "liveWebinar";
  if (["gdGroupDiscussions", "groupDiscussion", "gd-practice"].includes(value))
    return "gdGroupDiscussions";
  return "other";
};

const sessionTypeLabels: Record<SessionTypeKey, string> = {
  all: "All Session Types",
  resumeAnalysis: "Resume Analysis",
  mockInterview: "Mock Interview",
  liveWebinar: "Live Webinar",
  gdGroupDiscussions: "GD Practice",
  other: "Other",
};

const csvCell = (value: unknown) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sessionTypeFilter, setSessionTypeFilter] =
    useState<SessionTypeKey>("all");
  const [students, setStudents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Session expired. Please login again.");
        setIsLoading(false);
        return;
      }

      try {
        const [usersRes, bookingsRes] = await Promise.allSettled([
          axios.get(`${API_URL}/auth/all-users`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
            },
            timeout: 10000,
          }),
          axios.get(`${API_URL}/bookings/mentor`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }),
        ]);

        const users =
          usersRes.status === "fulfilled"
            ? usersRes.value.data.users || []
            : [];
        const bookings =
          bookingsRes.status === "fulfilled"
            ? bookingsRes.value.data.bookings || []
            : [];
        setBookings(bookings);

        // Build per-student session count and spend from real bookings
        const sessionMap: Record<string, number> = {};
        const spendMap: Record<string, number> = {};
        const sessionTypeMap: Record<
          string,
          Record<SessionTypeKey, number>
        > = {};
        bookings.forEach((b: any) => {
          const sid = b.studentId?._id || b.studentId;
          if (!sid) return;

          if (!sessionTypeMap[sid])
            sessionTypeMap[sid] = makeSessionTypeCounter();
          const normalizedType = normalizeSessionType(b.sessionType);
          sessionTypeMap[sid][normalizedType] += 1;
          sessionTypeMap[sid].all += 1;

          sessionMap[sid] = (sessionMap[sid] || 0) + 1;
          if (b.paymentStatus === "completed")
            spendMap[sid] = (spendMap[sid] || 0) + (b.amount || 0);
        });

        const studentsList = users.map((student: any) => ({
          sessionTypeCounts:
            sessionTypeMap[student._id] || makeSessionTypeCounter(),
          sessionTypes: Object.entries(
            sessionTypeMap[student._id] || makeSessionTypeCounter(),
          )
            .filter(([type, count]) => type !== "all" && count > 0)
            .map(([type]) => type as SessionTypeKey),
          id: student._id,
          name: student.name,
          email: student.email,
          mobile: student.mobile || "N/A",
          joinDate: student.createdAt || new Date().toISOString(),
          sessions: sessionMap[student._id] || 0,
          totalSpent: spendMap[student._id] || 0,
          status: student.isActive !== false ? "Active" : "Inactive",
          avatar: (student.name || "")
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
          skills: student.skills || [],
          userType: student.userType,
          company: student.company || "N/A",
          designation: student.designation || "N/A",
        }));

        setStudents(studentsList);
        setIsLoading(false);
      } catch (apiErr: any) {
        setStudents([]);
        setIsLoading(false);
      }
    } catch (err) {
      setStudents([]);
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      (student.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || student.status === statusFilter;

    const matchesSessionType =
      sessionTypeFilter === "all" ||
      (student.sessionTypeCounts?.[sessionTypeFilter] || 0) > 0;

    return matchesSearch && matchesStatus && matchesSessionType;
  });

  const sessionTypeStats = useMemo(() => {
    const stats = makeSessionTypeCounter();
    bookings.forEach((b: any) => {
      const normalizedType = normalizeSessionType(b.sessionType);
      stats[normalizedType] += 1;
      stats.all += 1;
    });
    return stats;
  }, [bookings]);

  const handleExportData = () => {
    if (filteredStudents.length === 0) {
      toast.error("No student data available for export");
      return;
    }

    const header = [
      "Student Name",
      "Email",
      "Mobile",
      "User Type",
      "Session Types",
      "Total Sessions",
      "Total Spent",
      "Status",
      "Joined Date",
    ];

    const rows = filteredStudents.map((student) => [
      student.name,
      student.email,
      student.mobile,
      student.userType,
      (student.sessionTypes || [])
        .map((type: SessionTypeKey) => sessionTypeLabels[type])
        .join(" | ") || "None",
      student.sessions,
      student.totalSpent,
      student.status,
      new Date(student.joinDate).toLocaleDateString("en-IN"),
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mentor-students-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Student data exported successfully");
  };

  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleUpdateStudent = (updatedStudent: any) => {
    setStudents(
      students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
    );
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleAddStudent = (newStudent: any) => {
    setStudents([newStudent, ...students]);
    setIsAddModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const token = localStorage.getItem("authToken");

        await axios.delete(`${API_URL}/auth/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudents(students.filter((s) => s.id !== id));
        toast.success(`${name} removed successfully`);
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.error || "Failed to remove student";
        toast.error(errorMsg);
      }
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("authToken");

      await axios.put(
        `${API_URL}/auth/users/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setStudents(
        students.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
      );
      toast.success(`Status changed to ${newStatus}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to update status";
      toast.error(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Student Management</h1>
          <p className="text-zinc-400 mt-2">Manage your enrolled students</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Add Student
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-blue-500 focus:outline-none transition"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button
          onClick={handleExportData}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20 transition font-semibold"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Session Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
        {(Object.keys(sessionTypeLabels) as SessionTypeKey[]).map((type) => (
          <button
            key={type}
            onClick={() => setSessionTypeFilter(type)}
            className={`rounded-xl border px-4 py-3 text-left transition ${
              sessionTypeFilter === type
                ? "border-blue-500/50 bg-blue-500/15"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            }`}
          >
            <p className="text-xs text-zinc-400">{sessionTypeLabels[type]}</p>
            <p className="text-2xl font-bold text-white mt-1">
              {sessionTypeStats[type]}
            </p>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: students.length,
            color: "from-blue-500/10",
          },
          {
            label: "Active Now",
            value: students.filter((s) => s.status === "Active").length,
            color: "from-emerald-500/10",
          },
          {
            label: "Total Sessions",
            value: students.reduce(
              (sum: number, s: any) => sum + s.sessions,
              0,
            ),
            color: "from-purple-500/10",
          },
          {
            label: "Revenue",
            value: `₹${students.reduce((sum: number, s: any) => sum + s.totalSpent, 0).toLocaleString()}`,
            color: "from-orange-500/10",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.color} to-transparent border border-zinc-800 rounded-lg p-4`}
          >
            <p className="text-zinc-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Students Table */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-black/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  User Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Session Types
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Sessions
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Spent
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-zinc-800 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {student.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-white">{student.name}</p>
                        <p className="text-xs text-zinc-400">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Mail size={14} className="text-zinc-400" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Phone size={14} />
                        {student.mobile}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        student.userType === "student"
                          ? "bg-blue-500/20 text-blue-300"
                          : student.userType === "professional"
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-zinc-700/50 text-zinc-300"
                      }`}
                    >
                      {student.userType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {(student.sessionTypes || []).length > 0 ? (
                        (student.sessionTypes as SessionTypeKey[]).map(
                          (type: SessionTypeKey) => (
                            <span
                              key={`${student.id}-${type}`}
                              className="px-2.5 py-1 rounded-full text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-400/20"
                            >
                              {sessionTypeLabels[type]}
                            </span>
                          ),
                        )
                      ) : (
                        <span className="text-xs text-zinc-500">
                          No sessions yet
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-blue-400" />
                      <span className="font-semibold text-white">
                        {student.sessions}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-emerald-400">
                      ₹{Number(student.totalSpent || 0).toLocaleString("en-IN")}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-zinc-300">
                      {new Date(student.joinDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(student.id, student.status)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                        student.status === "Active"
                          ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                          : "bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700/70"
                      }`}
                    >
                      {student.status}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-2 rounded-lg transition text-zinc-400 hover:bg-blue-500/10 hover:text-blue-300"
                        title="Edit student details"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id, student.name)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition"
                        title={`Delete ${student.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination — just a count since all records are shown */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          Showing {filteredStudents.length} of {students.length} student
          {students.length !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <span className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-500 text-sm cursor-default">
            All results shown
          </span>
        </div>
      </div>

      {/* Edit Modal */}
      <EditStudentModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        onUpdate={handleUpdateStudent}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStudent}
      />
    </div>
  );
}
