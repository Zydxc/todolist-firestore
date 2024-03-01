import { useEffect, useState } from "react";
import {
  getDocs,
  doc,
  addDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase-config.js";

export default function Main() {
  const [todoList, settodoList] = useState([]); // pending todolist
  const [items, setItems] = useState(""); // usestate hook with new item
  const [fetchAgain, setFetchAgain] = useState(false); // for reloading the webpage
  const [completedTask, setcompletedTask] = useState([]); // finished todo list
  const [filtersearch, setSearchedItems] = useState(""); // for the search functionality

  const getData = async () => {
    const pending_dataKo = [];
    const collectionRef = await getDocs(collection(db, "todo-list"));
    collectionRef.forEach((el) => {
      pending_dataKo.push({ ...el.data(), docID: el.id });
    });
    settodoList(pending_dataKo);
  };
  const getdata_fin = async () => {
    const fin_datako = [];
    const collectionref2 = await getDocs(collection(db, "finish-list"));
    collectionref2.forEach((el) => {
      fin_datako.push({ ...el.data(), docID: el.id });
    });
    setcompletedTask(fin_datako);
  };

  const cfm_pend_del = (id) => {
    let msg = "Do you want to delete this task?";
    if (window.confirm(msg) === true) {
      deleteTask(id);
    } else {
    }
  };

  const cfm_fin_del = (id) => {
    let msg = "Do you want to delete this task?";
    if (window.confirm(msg) === true) {
      deleteTask2(id);
    } else {
    }
  };

  useEffect(() => {
    getData();
    getdata_fin();
  }, []);

  useEffect(() => {
    if (fetchAgain) {
      getdata_fin();
      setFetchAgain(false);
    }
  }, [fetchAgain]);

  useEffect(() => {
    if (fetchAgain) {
      getData();
      setFetchAgain(false);
    }
  }, [fetchAgain]);


  const add_task = () => {
    if (items === "") {
      window.alert("Please have an input");
    } else {
      addDoc(collection(db, "todo-list"), {
        id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1, // id doesnt need to be incremented daw?? hmmm
        name: items,
        date: currentDate(),
        status: "Pending",
      });
      setItems("");
      setFetchAgain(true);
    }
  };

  // for the delete buttton //*  Can now delete but needs to select an ID
  const deleteTask = async (id) => {
    const del_doc = doc(db, "todo-list", id); //needs a value for the ID
    await deleteDoc(del_doc);
    setFetchAgain(true);
  };

  const deleteAll_FinDocs = () => {
  //   console.log(completedTask)
  //   const new_arr = [];
    // let del_all = doc(db, "finish-list", id);
    // new_arr= [...completedTask]
  //   console.log(new_arr);
  };

  const deleteTask2 = async (id) => {
    const del_doc = doc(db, "finish-list", id); //needs a value for the ID
    await deleteDoc(del_doc);
    setFetchAgain(true);
  };

  const fin_task = (date, name, id) => {
    addDoc(collection(db, "finish-list"), {
      // id: todoList.length === 0 ? 1 : todoList[todoList.length].id + parseInt(1) , // value is NaN : needs a fix
      name: name,
      date_created: date,
      Date_finished: currentDate(),
      status: "Finished",
    });
    setFetchAgain(true);
    deleteTask(id);
  };

  const searchHandle = (e) => {
    setSearchedItems(e.target.value);
  };

  const add_itemHandle = (e) => {
    setItems(e.target.value);
  };

  //  this function sets the current date
  const currentDate = (separator = "/") => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${year}${separator}${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${date}`;
  };

  return (
    <>
      <div className="py-3 font-mono text-2xl">
        <h2>To-do List App</h2>
      </div>

      <div>
        <input
          className="rounded-lg font-sans border-black border-solid "
          value={items}
          placeholder="Add a task"
          onChange={add_itemHandle}
        ></input>
        <button
          className="bg-lime-400 font-sans p-1 rounded-lg m-1.5"
          onClick={add_task}
        >
          {" "}
          Add Task
        </button>
      </div>

      <div>
        {" "}
        <h3> Search: </h3>
        <input
          className=""
          value={filtersearch}
          onChange={searchHandle}
        ></input>
      </div>

      <div className="py-3">
        <h3>Pending Tasks: </h3>
      </div>

      <div>
        <table className="content-center items-center">
          <tr className="bg-yellow-200 ">
            <td>Task No.</td>
            <td>Title: </td>
            <td>Date Created:</td>
            <td>Status:</td>
            <td>Actions: </td>
          </tr>
          {todoList
            .filter((item) => {
              return filtersearch.toLowerCase() === "" ? item : item.name.toLowerCase().includes(filtersearch);}) 
            // .sort((a,b) => { a.id - b.id}) // sort aint working
            .map((data) => {
              return (
                <tr>
                  <td>{data.id}</td>
                  <td>{data.name}</td>
                  <td>{data.date}</td>
                  <td className="decoration-lime-500">{data.status}</td>
                  <td>
                    <button
                      className="rounded-lg p-1 m-0.5 bg-lime-600 hover:bg-lime-400"
                      onClick={() => {
                        fin_task(data.date, data.name, data.docID);
                      }}
                    >
                      Mark as Done
                    </button>

                    <button
                      className="rounded-lg p-1 m-0.5 bg-fuchsia-800 hover:bg-fuchsia-600"
                      onClick={() => {
                        cfm_pend_del(data.docID);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                  <td></td>
                </tr>
              );
            })}
        </table>
      </div>

      <div className="py-3">
        <h3>Finished Tasks: </h3>
        <p>
          Action:
          <button
            className="bg-rose-800 p-1 rounded-lg hover:bg-rose-700"
            onClick={deleteAll_FinDocs()}
          >
            Delete All
          </button>
        </p>
      </div>

      <div>
        <table>
          <tr className="bg-yellow-200">
            <td>Title: </td>
            <td>Date created: </td>
            <td>Status: </td>
            <td>Date finished: </td>
            <td>Actions: </td>
          </tr>

          { completedTask.map((key) => {
            return (
              <tr>
                <td> {key.name}</td>
                <td>{key.date_created}</td>
                <td>{key.status}</td>
                <td>{key.Date_finished}</td>
                <td>
                  {" "}
                  <button
                  className="bg-orange-600 m-1 rounded-lg p-1 hover:bg-orange-400"
                    onClick={() => {
                      cfm_fin_del(key.docID);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
}
