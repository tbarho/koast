import React, { useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useLocation } from 'react-router-dom';

import { useKeyPress } from '../../hooks/useKeyPress';
import { TasksContext } from '../../context/tasks';


const schema = yup.object({
  taskName: yup.string().required(),
}).required();

function _AddTask({ className }: any) {
  const { pathname } = useLocation();
  const { addTask, hideAll }: any = useContext(TasksContext);
  const inputRef = useRef(null) as any;
  
  const { register, handleSubmit, formState:{ errors }, setFocus } = useForm({
    resolver: yupResolver(schema)
  });
  const { ref, ...inputProps } = register('taskName');

  function onSubmit(values) {
    addTask(pathname.replace('/', ''), values.taskName);
  }

  useKeyPress(() => {
    handleSubmit(onSubmit)();
  }, ['Enter']);

  useKeyPress(() => {
    hideAll();
  }, ['Escape'])

  useEffect(() => {
    if (setFocus) {
      setTimeout(() => {
        setFocus('taskName')
      }, 0);
    }
  }, [setFocus]);


  return (
    <div className={className}>
      <form onSubmit={e => e.preventDefault()} autoComplete="off">
        <input {...inputProps} ref={e => {
          ref(e);
          inputRef.current = e;
        }} placeholder="Add a task" />
        {/* <p>{errors.taskName?.message}</p> */}
      </form>
    </div>
  );
}

const AddTask = styled(_AddTask)`
  position: fixed;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  inset: 0px;
  padding: 14vh 16px 16px;
  
  form {
    transform: scale(0.99);
    max-width: 600px;
    width: 100%;
    background: rgb(26, 26, 26);
    color: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    overflow: hidden;
    box-shadow: rgb(0 0 0 / 10%) 0px 15px 25px 0px, rgb(0 0 0 / 30%) 0px 19px 45px 0px;
    pointer-events: auto;


    input {
      padding: 1.5rem;
      font-size: 20px;
      width: 100%;
      box-sizing: border-box;
      outline: none;
      border: none;
      background: rgb(26, 26, 26);
      color: rgb(255, 255, 255);
      font-family: monospace;
    }
  }

`;

export default AddTask;