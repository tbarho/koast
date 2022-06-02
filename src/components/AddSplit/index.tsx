import React, { useContext, useRef, useEffect } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { kebabCase } from "lodash";

import { useKeyPress } from "../../hooks/useKeyPress";
import { TasksContext } from "../../context/tasks";

const schema = yup
  .object({
    splitName: yup.string().required(),
  })
  .required();

function _AddSplit({ className }: any) {
  const navigate = useNavigate();
  const { addSplit, hideAll }: any = useContext(TasksContext);
  const inputRef = useRef(null) as any;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { ref, ...rest } = register("splitName");

  function onSubmit(values) {
    const splitName = kebabCase(values.splitName.toLowerCase());
    addSplit(splitName);
    navigate(`/${splitName}`, { replace: true });
    hideAll();
  }

  useKeyPress(() => {
    handleSubmit(onSubmit)();
  }, ["Enter"]);

  useKeyPress(() => {
    hideAll();
  }, ["Escape"]);

  useEffect(() => {
    if (setFocus) {
      setTimeout(() => {
        setFocus("splitName");
      }, 0);
    }
  }, [setFocus]);

  return (
    <div className={className}>
      <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
        <input
          {...rest}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
          placeholder="Type a new split name"
        />
        {/* <p>{errors.splitName?.message}</p> */}
      </form>
    </div>
  );
}

const AddSplit = styled(_AddSplit)`
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
    box-shadow: rgb(0 0 0 / 10%) 0px 15px 25px 0px,
      rgb(0 0 0 / 30%) 0px 19px 45px 0px;
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

export default AddSplit;
