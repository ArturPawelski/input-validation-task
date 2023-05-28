import React, { useState, useEffect } from 'react';

import { TextField, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FaPizzaSlice, FaPepperHot } from 'react-icons/fa';
import { IoMdResize } from 'react-icons/io';
import { GiSlicedBread } from 'react-icons/gi';

import BgImage from './images/main-background.png';
import BgPizza from './images/pizza-bg.png';
import BgSoup from './images/soup-bg.png';
import Bgbread from './images/bread-bg.png';

import { FormSchema, FormSchemaType } from './schema';

import './form.css';

const Form = () => {
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [backgroundImage, setBackgroundImage] = useState<string>(BgImage);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const inputsErrors: any = errors;

  const typeValue: 'pizza' | 'soup' | 'sandwich' = watch('type');

  useEffect(() => {
    if (typeValue === 'pizza') {
      setBackgroundImage(BgPizza);
    } else if (typeValue === 'soup') {
      setBackgroundImage(BgSoup);
    } else if (typeValue === 'sandwich') {
      setBackgroundImage(Bgbread);
    } else {
      setBackgroundImage(BgImage);
    }
  }, [typeValue]);

  const postToServer = async (data: FormSchemaType) => {
    try {
      const response = await fetch('https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setIsSent(true);

      if (response.ok) {
        setIsError(false);
        setIsSuccess(true);
        setSuccessMsg('Success, your order has been sent! ');
        const removeMessage = () => {
          setTimeout(() => {
            setIsError(true);
            setIsSuccess(false);
            setIsError(false);
          }, 4000);
        };
        removeMessage();
      } else {
        const errorData = await response.json();
        setIsSuccess(false);
        setIsError(true);
        setErrorMsg(`Error please try again! ${JSON.stringify(errorData)} `);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (data: FormSchemaType) => {
    postToServer(data);
    reset();
  };

  return (
    <main
      className='main-div'
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className='overlay'>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <section className='inputs-section'>
            <div className='div-with-error'>
              <TextField className='input' label='Dish name' type='text' {...register('name')} />
              {errors.name && <span className='errors'> {errors.name.message}</span>}
            </div>

            <div className='div-with-error'>
              <TextField
                className='input'
                label='Preparation time'
                type='time'
                inputProps={{
                  step: 1,
                  min: '00:00:00',
                  max: '99:59:59',
                }}
                defaultValue='00:00:00'
                {...register('preparation_time')}
              />
              {errors.preparation_time && <span className='errors'> {errors.preparation_time.message}</span>}
            </div>

            <div className='div-with-error'>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select label='Type' value={typeValue || ''} {...register('type')}>
                  <MenuItem value='pizza'>Pizza</MenuItem>
                  <MenuItem value='soup'>Soup</MenuItem>
                  <MenuItem value='sandwich'>Sandwich</MenuItem>
                </Select>
              </FormControl>
              {errors.type && <span className='errors'> {errors.type.message}</span>}
            </div>

            {typeValue === 'pizza' && (
              <section className='inputs-section'>
                <div className='div-with-error'>
                  <div className='div-with-icons'>
                    <FaPizzaSlice size={20} />
                    <TextField
                      className='input'
                      label='No of slices'
                      type='number'
                      {...register('no_of_slices', { shouldUnregister: true, valueAsNumber: true })}
                    />
                  </div>
                  {inputsErrors.no_of_slices && <span className='errors'> {inputsErrors.no_of_slices.message}</span>}
                </div>

                <div className='div-with-error'>
                  <div className='div-with-icons'>
                    <IoMdResize size={22} />
                    <TextField
                      className='input'
                      label='Diameter'
                      type='number'
                      {...register('diameter', { shouldUnregister: true, valueAsNumber: true })}
                    />
                  </div>
                  {inputsErrors.diameter && <span className='errors'> {inputsErrors.diameter.message}</span>}
                </div>
              </section>
            )}

            {typeValue === 'soup' && (
              <section className='inputs-section'>
                <div className='div-with-error'>
                  <div className='div-with-icons'>
                    <FaPepperHot size={22} />
                    <TextField
                      className='input'
                      label='Spiciness scale 1-10'
                      type='number'
                      {...register('spiciness_scale', { shouldUnregister: true, valueAsNumber: true })}
                    />
                  </div>
                  {inputsErrors.spiciness_scale && <span className='errors'> {inputsErrors.spiciness_scale.message}</span>}
                </div>
              </section>
            )}

            {typeValue === 'sandwich' && (
              <section className='inputs-section'>
                <div className='div-with-error'>
                  <div className='div-with-icons'>
                    <GiSlicedBread size={23} />
                    <TextField
                      className='input'
                      label='Slices of bread 1-20 '
                      type='number'
                      {...register('slices_of_bread', { shouldUnregister: true, valueAsNumber: true })}
                    />
                  </div>
                  {inputsErrors.slices_of_bread && <span className='errors'> {inputsErrors.slices_of_bread.message}</span>}
                </div>
              </section>
            )}

            <Button color='primary' type='submit' variant='contained'>
              Submit
            </Button>
          </section>

          {isSent && isError && <h1 className='error_from_api'>{errorMsg}</h1>}
          {isSent && isSuccess && <h1 className='success_from_api'>{successMsg}</h1>}
        </form>
      </div>
    </main>
  );
};

export default Form;
