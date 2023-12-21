import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import './../App.css';
import CancelIcon from '@mui/icons-material/Cancel';

const WhiteTextField = styled(TextField)`
  background-color: #fff;
  @keyframes shake {
    0% { transform: translateX(0); }
    10% { transform: translateX(-5px); }
    20% { transform: translateX(5px); }
    30% { transform: translateX(-5px); }
    40% { transform: translateX(5px); }
    50% { transform: translateX(-5px); }
    60% { transform: translateX(5px); }
    70% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
    90% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
  }
  ${props => !props.validated && css`
    border: 2px solid rgb(240, 0, 0) !important;
    animation: shake 1.5s ease-in-out;
  `}
`
const WhiteButton = styled(Button)`
    background: transparent;
    color: white !important;
`
const FlexForm = styled.form`
  display: flex;
`
const WhiteIconButton = styled(IconButton)`
  color: #DE3939 !important;
`

export default function InputForm(props){ // setFormVisible, type, fileStructure, setFileStructure, currentFolder, level

  const [inputName, setInputName] = useState('');

  useEffect(()=>{
    if(props.fromDelete==='1'){
      setInputName(props.ele.name)
    }
  }, [props.fromDelete]);
  const [validated, setValidated] = useState(true);
  const [failingValidation, setFailingValidation] = useState('Please enter the correct name.');
  const inputRef = useRef(null);
  useEffect(() => {
    // Focus on the TextField when the component mounts
    inputRef.current.focus();
  }, []);


  function checkEmptyNames(){
    if (inputName === ''){
      setFailingValidation(`Please enter a ${props.type} name.`)
      return false;
    }else{
      return true;
    }
  }
  function checkFileExtensions(){
    // regex wow
    // let x = /(?:\.([^.]+))?$/;
    // let ext = x.exec(inputName)[1];
    // // console.log(ext);

    let fileExt = inputName.split('.').pop();
    // console.log(fileExt);
    if(fileExt === 'txt' || fileExt === 'htm' || fileExt === 'html' || fileExt === 'css' || fileExt === 'js'){
      return fileExt;
    }
    setFailingValidation(`Please enter a valid ${props.type} extension.`)
    return false;
  }

  function checkIdenticalNames(){
    console.log(props.fileStructure);
    let flag = true;
    props.fileStructure.map((ele) => {
      if(ele.name === inputName && ele.type === props.type && ele.level === props.level){
        setFailingValidation(`Please enter a different ${props.type} name.`)
        flag=false;
      }
      return 0;
    })
    return flag;
  }

  function checkInvalidName(){
    for(let i of inputName){
      if (i === '<' || i === '>' || i === '*' || i === '?' || i === ':' || i === '"'){
        setFailingValidation(`Please enter a valid ${props.type} name.`)
        return false;
      }
    }
    return true;
  }


  function validations(){
    const emptyNames = checkEmptyNames();
    if(!emptyNames){
      return false;
    }
    let fileExtensions = true;
    if(props.type==='file'){
      fileExtensions = checkFileExtensions();
      if(!fileExtensions){
        return false;
      }
    }
    const identicalNames = checkIdenticalNames(props.fileStructure);
    if(!identicalNames){
      return false;
    }
    const invalidName = checkInvalidName();
    if(!invalidName){
      return false;
    }
    return true;
  }

  function formSubmitted(e){
    e.preventDefault();
    if(validations()){
      if(props.fromDelete === '1'){
        props.ele.name = `${inputName}`;
        props.setFormVisible(false);
        props.setRenderAgain(Math.ceil(Math.random()*10000));
        props.setDeleted(false);
        return;
      }
      props.setFormVisible(false);
      let newEntry;
      let classNumber = Math.ceil(Math.random()*10000);
      if(props.type === 'file'){
        newEntry = {
          name: `${inputName}`,
          type: 'file',
          number: classNumber,
          level: props.level
        }
      }else{
        newEntry = {
          name: `${inputName}`,
          type: 'folder',
          children: [],
          number: classNumber,
          level: props.level
        }
      }
      let found=false;
      function pushInFolder(fs){
        if(found){
          return;
        }
        for(let i in fs){
          if(fs[i].name === props.currentFolder){
            fs[i].children.push(newEntry);
            found=true;
            return;
          }
        }
        for(let i in fs){
          if(fs[i].type === 'folder'){
            pushInFolder(fs[i].children);
          }
        }
      }
      if(props.currentFolder === 'File Explorer'){
        let location = props.fileStructure;
        location.push(newEntry);
        props.setFileStructure(location);
      }else{
        pushInFolder(props.fileStructure);
      }
      // console.log(props.fileStructure);
    }else{
      setValidated(false);
    }
  }
  const handleChange = (e) => {
    setInputName(e.target.value);
  }
  const cancelBtnclicked = () => {
    props.setFormVisible(false);
    if(props.fromDelete==='1'){
      props.setDeleted(false);
    }
  }
  return (
    <li>
      <FlexForm onSubmit={(e)=>formSubmitted(e)}>
        <Tooltip title={validated ? null : failingValidation}>
          <WhiteTextField validated={validated} value={inputName} onChange={(e)=>handleChange(e)} placeholder={"Enter " + props.type + " name."} inputRef={inputRef}
          ></WhiteTextField>
        </Tooltip>
        <WhiteButton type="submit">Add</WhiteButton>
        <Tooltip title="cancel"><WhiteIconButton onClick={cancelBtnclicked} ><CancelIcon/></WhiteIconButton></Tooltip>
      </FlexForm>
    </li>
  )
}