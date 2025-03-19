// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";




// const useGetConversations = () => {
// 	const [loading, setLoading] = useState(false);
// 	const [conversations, setConversations] = useState([]);

// 	useEffect(() => {
// 		const getConversations = async () => {
			
// 		  setLoading(true);
// 		  try {
// 			const token = localStorage.getItem("token");
// 			const res = await axios.get("http://localhost:3000/api/conversations", {
//           headers: { Authorization: `Bearer ${token}` }, // Token headers me pass karo
//         });
// 			setConversations(res.data); // Axios response automatically parses JSON
// 		  } catch (error) {
// 			toast.error(error.response?.data?.error || error.message);
// 		  } finally {
// 			setLoading(false);
// 		  }
// 		};
	  
// 		getConversations();
// 	  }, []);

// 	return { loading, conversations };
// };
// export default useGetConversations;
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const getConversations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Token not found! Please log in.");
          return;
        }

        // console.log("Using Token:", token);

        const res = await axios.get("http://localhost:3000/api/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("Response Data:", res.data);

        if (isMounted) {
          if (Array.isArray(res.data)) {
            setConversations(res.data);
          } else {
            console.error("Unexpected Response Format:", res.data);
            toast.error("Invalid data format received from server.");
          }
        }
      } catch (error) {
        console.error("Axios Error:", error);
        toast.error(error.response?.data?.error || "Failed to fetch conversations!");
      } finally {
        setLoading(false);
      }
    };

    getConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
