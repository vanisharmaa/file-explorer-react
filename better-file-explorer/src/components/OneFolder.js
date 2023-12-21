import { Typography, IconButton, Button } from '@mui/material';
import styled from 'styled-components';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolder';
import { useState } from 'react';
import InputForm from './InputForm';
import RenderFileStructure from './RenderFileStructure';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const WhiteButton = styled(Button)`
    background: transparent;
    color: white !important;
    padding: 0 !important;
`
const BoldTypography = styled(Typography)`
  font-weight: 800 !important;
  white-space: nowrap;
  width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: justify;
`
const WhiteIconButton = styled(IconButton)`
  color: white !important;
`
const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
  &:hover {
      background-color: #444;
    }
`
export default function OneFolder(props){
  const [arrow, setArrow] = useState(false); // 0 = right
  const [type, setType] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [currentFolder, setCurrentFolder] = useState('');
  const [deleted, setDeleted] = useState(false);
  const [editFormVisible, setEditFormVisible] = useState(false);

  function nameBtnClicked(){
    setArrow(!arrow);
  }
  function createNew(e, type){
    if(!arrow){
      setArrow(!arrow);
    }
    setCurrentFolder(e.currentTarget.parentElement.parentElement.firstChild.firstChild.nextSibling.innerHTML);
    setType(type);
    setFormVisible(true);

  }
  function deleteBtnClicked(e){
    let found=false;
    const currentFolder = (e.currentTarget.parentElement.firstChild.firstChild.nextSibling.innerHTML);
    function deleteFolder(fs){
      if(found){
        return;
      }
      for(let i in fs){
        if(fs[i].name === currentFolder){
          // fs[i].children.push(newEntry);
          fs.splice(i, 1);
          found=true;
          return;
        }
      }
      for(let i in fs){
        if(fs[i].type === 'folder'){
          deleteFolder(fs[i].children);
        }
      }
    }
    deleteFolder(props.fileStructure);
    console.log(props.fileStructure);
    setDeleted(true);
  }
  function editBtnClicked(e, ele){
    // alert('edit');
    setDeleted(true)
    setEditFormVisible(true);
  }
  return (
    <>
    {!deleted && <li>
        <FlexDiv>
          <WhiteButton onClick={nameBtnClicked}>
            <WhiteIconButton>
              {arrow ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon />}
            </WhiteIconButton>
            <BoldTypography  title={props.ele.name}>{props.ele.name}</BoldTypography>
          </WhiteButton>

          <span>
            <WhiteIconButton onClick={(e)=>editBtnClicked(e, props.ele)}>
              <EditIcon/>
            </WhiteIconButton>
            <WhiteIconButton onClick={(e)=>deleteBtnClicked(e)}>
              <DeleteIcon />
            </WhiteIconButton>
            <WhiteIconButton onClick={(e)=>createNew(e, "file", 0)}>
              <NoteAddOutlinedIcon />
            </WhiteIconButton>
            <WhiteIconButton onClick={(e)=>createNew(e, "folder", 0)}>
              <CreateNewFolderOutlinedIcon />
            </WhiteIconButton>
          </span>
        </FlexDiv>
        {arrow && <ul>
          {formVisible && <InputForm setFormVisible={(val)=>setFormVisible(val)} type={type} fileStructure={props.fileStructure} setFileStructure={(val)=>props.setFileStructure(val)} currentFolder={currentFolder} level={props.level+1}/>}
          <RenderFileStructure fileStructure={props.ele.children} level={props.level+1}/>
        </ul>}
      </li>}
      {editFormVisible && <InputForm setFormVisible={(val)=>setEditFormVisible(val)} type='folder' fileStructure={props.fileStructure} setFileStructure={(val)=>props.setFileStructure(val)} currentFolder={props.fileStructure} fromDelete='1' ele={props.ele} deleteBtnClicked={(e, ele)=> deleteBtnClicked(e, ele) } setRenderAgain={(val)=>props.setRenderAgain(val)} setDeleted={(val)=>setDeleted(val)} level={props.level}/>}
    </>
  )
}