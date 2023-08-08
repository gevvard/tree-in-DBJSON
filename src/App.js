import {UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider} from "react-complex-tree";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import { ToastContainer } from 'react-toastify';

import {AiFillSave} from "@react-icons/all-files/ai/AiFillSave";
import {BiEdit} from "@react-icons/all-files/bi/BiEdit";
import {RiDeleteBinLine} from "@react-icons/all-files/ri/RiDeleteBinLine";
import {BsPlusCircle} from "@react-icons/all-files/bs/BsPlusCircle";
import {VscDiffAdded} from "@react-icons/all-files/vsc/VscDiffAdded";
import {ImHome3} from "@react-icons/all-files/im/ImHome3";

import {addDataThunk, deleteDataTHunk, getDataThunk} from "./redux/action/dataAction";

import 'react-toastify/dist/ReactToastify.css';
import "react-complex-tree/lib/style.css"
import css from "../src/App.module.scss";

function addProp(obj, prop, tobeAdded) {
  function recursivelyFindProp(o, keyToBeFound) {
    if (o != null) {
      Object.keys(o).forEach(function (key) {
        if (!!o && typeof o[key] === 'object' && !o.hasOwnProperty(keyToBeFound)) {
          recursivelyFindProp(o[key], keyToBeFound);
        } else {
          if (key === keyToBeFound) {
            if (o[key] == null) {
              let y = {}
              y[tobeAdded] = null;
              o[key] = y;
            } else {
              o[key][tobeAdded] = null;
            }

          }
        }
      });
    }
  }

  recursivelyFindProp(obj, prop);
}

function deleteItem(obj, tobeDeleted) {
  function recursivelyFindProp(o, keyToBeFound) {
    if (o != null) {
      Object.keys(o).forEach(function (key) {
        if (!!o && typeof o[key] === 'object' && !o.hasOwnProperty(keyToBeFound)) {
          recursivelyFindProp(o[key], keyToBeFound);
        } else {
          if (key === keyToBeFound) {
            delete o[key];
          }
        }
      });
    }
  }

  recursivelyFindProp(obj, tobeDeleted);
}

function editItem(obj, prop, newValue) {
  function recursivelyFindProp(o, keyToBeFound) {
    console.log('recursivelyFindProp', o, keyToBeFound)
    if (o != null) {
      Object.keys(o).forEach(function (key) {
        if (!!o && typeof o[key] === 'object' && !o.hasOwnProperty(keyToBeFound)) {
          recursivelyFindProp(o[key], keyToBeFound);
        } else {
          if (key === keyToBeFound) {
            let val
            if (typeof o[key] === 'object' && o[key] != null) {
              val = {...o[key]}
            } else {
              val = o[key]
            }
            o[newValue] = val;
            delete o[key];
          }
        }
      });
    }
  }

  recursivelyFindProp(obj, prop);
}

export default function App() {
  const dispatch = useDispatch();
  const environment = useRef();
  const tree = useRef();
  const {data} = useSelector(state => state.data);

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(null);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [key, setKey] = useState();
  const [formType, setFormType] = useState('');

  useEffect(() => {
    if (data.length) {
      setState(data);
    }
  }, [data]);


  const add = () => {
    setLoading(true)
    addProp(state[0], key, newItem);
    dispatch(addDataThunk(state[0], 'added')).then(_ => {
      dispatch(getDataThunk()).then(_ => setLoading(false))
      setOpen(false);
      setNewItem("");
      setLongTree(null);
    });

  }

  const readTemplate = (template, data = {items: {}}) => {
    for (const [key, value] of Object.entries(template)) {
      console.log('key, value: ', key, value)
      data.items[key] = {
        index: key,
        canMove: true,
        hasChildren: value !== null,
        children: value !== null ? Object.keys(value) : undefined,
        data: key,
        canRename: true,
      };
      if (value !== null) {
        readTemplate(value, data);
      }
    }
    return data;
  };

  useEffect(() => {
    dispatch(getDataThunk());
  }, []);

  const [longTree, setLongTree] = useState(null);

  useEffect(() => {
    if (state?.length) {
      setLongTree(readTemplate(state));
    }
  }, [state])

  const openEditForm = (fieldName) => {
    setOpen(true);
    setNewItem(fieldName);
    setKey(fieldName);
    setFormType('edit');
  }


  const handleItemEdit = () => {
    if (newItem == '') {
      return;
    }
    if (key == newItem) {
      setOpen(false);
      return;
    }
    editItem(state[0], key, newItem)
    dispatch(addDataThunk(state[0], 'edited')).then(_ => {
      setState(null);
      setLongTree(null);
      dispatch(getDataThunk()).then(_ => setLoading(false));
      setOpen(false);
      setKey('');
      setNewItem("");
      setFormType('');
    });
  }

  const handleDelete = (fieldName) => {
    deleteItem(state[0], fieldName);
    dispatch(deleteDataTHunk(state[0])).then(_ => {
      setState(null);
      setLongTree(null);
      dispatch(getDataThunk()).then(_ => setLoading(false));
    });
  }

  const addNewSection = () => {
    if (!!newItem) {
      setLoading(true);
      state[0]['root'][newItem] = null;
      dispatch(addDataThunk(state[0], 'added')).then(_ => {
        dispatch(getDataThunk()).then(_ => setLoading(false));
        setOpen(false);
        setNewItem("");
        setLongTree(null);
      });
    }

  }

  return (
    <div className={css.wrapper}>
      <ToastContainer/>
      <div className={css.addMenu}>
        <div onClick={() => {
          setOpen(true);
          setKey('add');
          setNewItem('');
        }}><VscDiffAdded></VscDiffAdded></div>
      </div>
      {
        open && key === 'add' ? <div className={css.addMenuInput}>
          <fieldset>
            <legend>
              Add
            </legend>
            <input type='text' value={newItem} onChange={(e) =>
              setNewItem(e.target.value)}/>
          </fieldset>
          <AiFillSave className={css.icon} onClick={() => addNewSection()}></AiFillSave>
        </div> : ""
      }
      {!loading && longTree ?
        <UncontrolledTreeEnvironment
          classname={css.slider}
          ref={environment}
          canDragAndDrop={true}
          canDropOnItemWithChildren={true}
          canReorderItems={true}
          dataProvider={new StaticTreeDataProvider(longTree.items, (item, data) => ({...item, data}))}
          getItemTitle={(item) => {
            return <div className={css.menu}>
              <div className={css.menuCont}>
                <span>
                <ImHome3 className={css.homeIcon}></ImHome3>
                {item.data}
                </span>
                <span className={css.menuItem}>
                <span className={css.icon}
                      onClick={() => {
                        setOpen(true)
                        setKey(item.data)
                        setNewItem('');
                        setFormType('add')
                      }
                      }
                ><BsPlusCircle></BsPlusCircle></span>
              <span className={css.icon} onClick={() => openEditForm(item.data)}><BiEdit></BiEdit></span>
              <span className={css.delete}
                    onClick={() => handleDelete(item.data)}><RiDeleteBinLine></RiDeleteBinLine></span>
            </span>
              </div>
              {
                open && key === item.data ? 
                <span className={css.addForm}>
                  <input type='text' value={newItem} onChange={(e) =>
                    setNewItem(e.target.value)}/>
                  <span
                    className={css.spanAdd}
                    onClick={() => {
                      formType === 'edit' ? handleItemEdit() : add(item)
                    }}
                  >{formType === 'edit' ? <BiEdit></BiEdit> : <AiFillSave></AiFillSave>}</span>
                </span> : ''
              }
            </div>
          }}
          viewState={{
            'tree-1': {},
          }
          }
        >
          <Tree treeId="tree-1" rootItem="root" treeLabel="Tree 1" ref={tree}/>
        </UncontrolledTreeEnvironment>
        : ''
      }
    </div>
  );
}