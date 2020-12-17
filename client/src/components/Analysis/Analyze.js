import React, {useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import { stat } from 'fs';

const Analyze=({Analysis}) => {
    let history = useHistory();
    const [statnum, stattotalnum, statmean, statdeviation] = useState({
        statnum: [0],
        stattotalnum:0,
        statdeviation:0,
        statmean:0
    });
    const[errorData, setErrorData] = useState({errors:null});

    const {statnum, stattotalnum, statdeviation, statmean} = analyzedData;
    const {errors} = errorData;

const AnalyzeMean(statnum, stattotalnum, statmean) = async() => {
    statmean = sum[statnum]/stattotalnum;
    if(!statnum){
        console.log('You need numbers to analyze');
    }
    else{
        const newMeanAnalysis = {
            statnum: statnum,
            stattotalnum: stattotalnum,
            statmean: statmean
        }
        try{
            const config = {
                headers:{
                    'Content-Type':'application/json'
                }
            }
            const statmean = JSON.parse.toString(newMeanAnalysis);
            const res = await axios.post('http://localhost:5000/api/users', body, config);

            //store user data and redirect
            localStorage.setItem('token', res.data.token);
            history.pushState('/');
        }catch(error){
            //clear user data and set errors
            localStorage.removeItem('token');

            setErrorData({
                ...errors,
                errors: error.response.data.errors
            })
        }
        Analysis();
    
    }

    const AnalyzeDeviation(statmean,stattotalnum,statdeviation) = async() => {
        statdeviation = [statmean-[statnum]]/stattotalnum;
    if(!statmean){
        console.log('You need numbers to analyze');
    }
    else{
        const newDeviationAnalysis = {
            statnum: statnum,
            stattotalnum: stattotalnum,
            statmean: statmean,
            statdeviation: statdeviation
        }
        try{
            const config = {
                headers:{
                    'Content-Type':'application/json'
                }
            }
            const statdeviation = JSON.parse.toString(newDeviationAnalysis);
            const res = await axios.post('http://localhost:5000/api/users', body, config);

            //store user data and redirect
            localStorage.setItem('token', res.data.token);
            history.pushState('/');
        }catch(error){
            //clear user data and set errors
            localStorage.removeItem('token');

            setErrorData({
                ...errors,
                errors: error.response.data.errors
            })
        }
        Analyze();
    
    }

  return(
    <div>
        <div>
            <button onClick={() => analyzedMean()}>Mean</button>
            <button onClick={() => analyzedDeviation()}>Deviation</button>
        </div>
        <div>
            {errors && errors.map(error => <div key={error.msg}>{error.msg}</div>)}
        </div>
    </div>
    
  )  
}

}
export default Analyze;