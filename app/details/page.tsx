"use client";

import { useEffect, useState } from "react";

const UsersPage = () => {
  interface User {
    name: string;
    email: string;
    role: string;
    avatar: string;
  }

  const [users, setUsers] = useState<User[] | null>(null); // Updated state for multiple users
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/getuser");
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users); // Set the list of users to state
        } else {
          const errorData = await response.json();
          setError(errorData.error); // Set error message if request fails
        }
      } catch (error) {
        setError("An error occurred while fetching user details.");
        console.error("Error fetching user details:", error);
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!users) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Users Details</h1>
      {users.map((user) => (
        <div key={user.email}>
          <img src={user.avatar} alt="User Avatar" width={100} height={100} />
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ))}
    </div>
  );
};

export default UsersPage;
