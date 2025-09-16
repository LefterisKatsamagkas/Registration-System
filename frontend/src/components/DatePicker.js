import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';


export default function DatePickerValue({onStartDateSubmit, onEndDateSubmit, initialDate, finalDate}) {
    const [startDate, setStartDate] = useState(dayjs(initialDate));
    const [endDate, setEndDate] = useState(dayjs(finalDate)); 
    

    
    useEffect(() => {
        //console.log(endDate);
        onStartDateSubmit(startDate.toDate())        
        onEndDateSubmit(endDate.toDate())        
    }, [startDate, endDate])


    // Create a custom theme
    const theme = createTheme({
        palette: {
            primary: {
                main: '#6448ef', // Change this to your desired primary color
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker
                        label="Event Start Date"
                        value={startDate}
                        minDate={dayjs()}
                        format="DD-MM-YYYY"
                        onChange={(newValue) => {
                            setStartDate(newValue);
                            setEndDate(newValue);
                        }}
                    />
                    <DatePicker
                        label="Event End Date"
                        value={endDate}
                        minDate={startDate}
                        format="DD-MM-YYYY"
                        onChange={(newValue) => {
                            setEndDate(newValue); 
                        }}
                    />
                </DemoContainer>
            </LocalizationProvider>
        </ThemeProvider>
    );
}
