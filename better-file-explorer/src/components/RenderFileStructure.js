import AbcIcon from '@mui/icons-material/Abc';import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import JavascriptIcon from '@mui/icons-material/Javascript';
import { Typography, IconButton, Tooltip } from '@mui/material';
import styled, { css } from 'styled-components';
import OneFolder from './OneFolder';
import DeleteIcon from '@mui/icons-material/Delete';
import './../App.css';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import InputForm from './InputForm';

const InlineTypography = styled(Typography)`
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;

`
const HoverableLi = styled.li`
  &:hover {
      background-color: #444;
  }
  display: flex;
  justify-content: space-between;
`
const WhiteIconButton = styled(IconButton)`
  color: white !important;
  ${props => (props.fileExt === "html" || props.fileExt === "htm") && css`color: #E5532D !important`}
  ${props => (props.fileExt === "css" ) && css`color: #3D9CD9 !important`}
  ${props => (props.fileExt === "js" ) && css`color: #FAB337 !important`}
  ${props => (props.fileExt === "txt" ) && css`color: #66DF5B !important`}
`
// const FlexSpan = styled.span
function RenderFiles( props ){
  const [deleted, setDeleted] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  let fileExt;
  function findExt(ele){
    // console.log(ele);
    fileExt = ele.split('.').pop();
  }
  function fileIcon(){
    if (fileExt === "html" || fileExt === "htm"){
      return <HtmlIcon />
    }else if(fileExt === "css"){
      return <CssIcon />
    }else if(fileExt === "js"){
      return <JavascriptIcon/>
    }else if(fileExt==='txt'){
      return <AbcIcon/>
    }
  }
  function deleteBtnClicked(e, ele){
    setDeleted(true);
    for(let i in props.fileStructure){
      if(props.fileStructure[i] === ele){
        props.fileStructure.splice(i, 1);
        console.log(props.fileStructure);
        return;
      }
    }
  }
  function editBtnClicked(e, ele){
    setDeleted(true);
    console.log(ele.name);
    setFormVisible(true);
  }
  return (
    <>
      {!deleted &&
        <HoverableLi>{findExt(props.ele.name)}
          {props.ele.type==='file' ?
          <>
            <span>
              <WhiteIconButton fileExt={fileExt}>
                {fileIcon()}
              </WhiteIconButton>
              {props.ele.name.length > 15 ?
              <Tooltip title={props.ele.name}>
                <InlineTypography>{props.ele.name}</InlineTypography>
              </Tooltip> :
              <InlineTypography>{props.ele.name}</InlineTypography>}
            </span>
              <span>
              <WhiteIconButton onClick={(e)=>editBtnClicked(e, props.ele)}>
                <EditIcon/>
              </WhiteIconButton>
              <WhiteIconButton onClick={(e)=>deleteBtnClicked(e, props.ele)}>
                <DeleteIcon/>
              </WhiteIconButton>
              </span>
          </> : null }
        </HoverableLi>}
        {formVisible && <InputForm setFormVisible={(val)=>setFormVisible(val)} type='file' fileStructure={props.fileStructure} setFileStructure={(val)=>props.setFileStructure(val)} currentFolder={props.fileStructure} fromDelete='1' ele={props.ele} deleteBtnClicked={(e, ele)=> deleteBtnClicked(e, ele) } setRenderAgain={(val)=>props.setRenderAgain(val)} setDeleted={(val)=>setDeleted(val)} level={props.level}/>}
    </>
  )
}
function RenderFolders( props ){
  return (
    <>
    <li>
      {props.ele.type==='folder' ? <OneFolder ele={props.ele} fileStructure={props.fileStructure} setFileStructure={(val)=>props.setFileStructure(val) } level={props.level} setRenderAgain={(val)=>props.setRenderAgain(val)}/> : null }
    </li>
    </>
  )
}

export default function RenderFileStructure(props){

  const [renderAgain, setRenderAgain] = useState(1);

  props.fileStructure.sort((a, b) => {
    // Use the localeCompare() method to compare strings
    return a.name.localeCompare(b.name);
  });

  return (
    renderAgain && <>
      {props.fileStructure.map((ele) => <RenderFiles fileStructure={props.fileStructure} fileType={props.fileType} ele={ele} setFileStructure={(val)=>props.setFileStructure(val)} setRenderAgain={(val)=>setRenderAgain(val)} level={props.level} />)}
      {props.fileStructure.map((ele) => <RenderFolders fileStructure={props.fileStructure} setFileStructure={(val)=>props.setFileStructure(val) } ele={ele} level={props.level} setRenderAgain={(val)=>setRenderAgain(val)}  /> )}
    </>
  )
}