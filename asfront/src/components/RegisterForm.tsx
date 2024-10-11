import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser, getAgencies } from '../api';
import { useNavigate } from 'react-router-dom';
import "./RegisterForm.css"
const RegisterForm = () => {
    const [message, setMessage] = useState('');
    const [agencies, setAgencies] = useState<any[]>([]);
    const [loadingAgencies, setLoadingAgencies] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const response = await getAgencies();
                setAgencies(response.data);
            } catch (error) {
                console.error('Error fetching agencies:', error);
            } finally {
                setLoadingAgencies(false);
            }
        };
        fetchAgencies();
    }, []);

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            gender: '',
            userType: 'Job Seeker',
            hobbies: [],
            profileImage: null,
            resume: null,
            agencyId: '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            phone: Yup.string().required('Required').matches(/^[0-9]+$/, 'Must be a number'),
            // gender: Yup.string().required('Required'),
            userType: Yup.string().required('Required'),
            hobbies: Yup.array().of(Yup.string()),
            profileImage: Yup.mixed().required('Profile image is required'),
            // resume: Yup.mixed().when(['userType'],(userType:any, schema)=> {
            //     if(userType=== 'Job Seeker')return Yup.mixed().required('Resume is required')
            //         return schema
            // }),
            // agencyId: Yup.string().when(['userType'],(userType:any, schema)=> {
            //     if(userType=== 'Job Seeker')return Yup.string().required('Agency selection is required')
            //         return schema
            // }),
        }),
        onSubmit: async (values) => {
            console.log(values)
            const formData = new FormData();
            formData.append('firstName', values.firstName);
            formData.append('lastName', values.lastName);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('gender', values.gender);
            formData.append('userType', values.userType);
            formData.append('profileImage', JSON.stringify(values.profileImage));
            if (values.userType === 'Job Seeker') {
                formData.append('resume', JSON.stringify(values.resume));
                formData.append('agencyId', values.agencyId);
            }

            try {
                
                await registerUser(formData);
                
                setMessage('Registration successful! Check your email for details.');
                formik.resetForm();
                navigate('/password-reset');
            } catch (error) {
                setMessage(`Registration failed. Please try again.${error}`);
            }
        },
    });
    console.log(formik.errors);
    

    return (
        <form onSubmit={formik.handleSubmit}>
            <div>
                <label>First Name</label>
                <input type="text" {...formik.getFieldProps('firstName')} />
                {formik.touched.firstName && formik.errors.firstName ? <div>{formik.errors.firstName}</div> : null}
            </div>
            <div>
                <label>Last Name</label>
                <input type="text" {...formik.getFieldProps('lastName')} />
                {formik.touched.lastName && formik.errors.lastName ? <div>{formik.errors.lastName}</div> : null}
            </div>
            <div>
                <label>Email</label>
                <input type="email" {...formik.getFieldProps('email')} />
                {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
            </div>
            <div>
                <label>Phone</label>
                <input type="text" {...formik.getFieldProps('phone')} />
                {formik.touched.phone && formik.errors.phone ? <div>{formik.errors.phone}</div> : null}
            </div>
            <div>
                <label>Gender</label>
                <label>
                    <input
                        type="radio"
                        name="gender"
                        value="Male"
                       
                    />
                    Male
                </label>
                <label>
                    <input
                        type="radio"
                        name="gender"
                        value="Female"
                        
                    />
                    Female
                </label>
                {formik.touched.gender && formik.errors.gender ? <div>{formik.errors.gender}</div> : null}
            </div>
            <div>
                <label>User Type</label>
                <select
                    {...formik.getFieldProps('userType')}
                    onChange={(e) => {
                        formik.setFieldValue('userType', e.target.value);
                        if (e.target.value === 'Job Seeker') {
                            formik.setFieldValue('agencyId', '');
                        }
                    }}
                >
                    <option value="Job Seeker">Job Seeker</option>
                    <option value="Agency">Agency</option>
                </select>
                {formik.touched.userType && formik.errors.userType ? <div>{formik.errors.userType}</div> : null}
            </div>
            <div>
                <label>Hobbies</label>
                {['Sports', 'Dance', 'Reading', 'Singing'].map((hobby) => (
                    <label key={hobby}>
                        <input
                            type="checkbox"
                            value={hobby}
                            onChange={(event) => {
                                const checked = event.target.checked;
                                const currentHobbies = formik.values.hobbies;
                                if (checked) {
                                    formik.setFieldValue('hobbies', [...currentHobbies, hobby]);
                                } else {
                                    formik.setFieldValue('hobbies', currentHobbies.filter((h) => h !== hobby));
                                }
                            }}
                        />
                        {hobby}
                    </label>
                ))}
            </div>
            <div>
                <label>Profile Image</label>
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(event) => {
                        const file = event.currentTarget.files![0];
                        formik.setFieldValue('profileImage', file);
                    }}
                />
                {formik.touched.profileImage && formik.errors.profileImage ? <div>{formik.errors.profileImage}</div> : null}
            </div>
            {formik.values.userType === 'Job Seeker' && (
                <>
                    <div>
                        <label>Resume</label>
                        <input
                            type="file"
                            accept=".docx,.pdf"
                            onChange={(event) => {
                                const file = event.currentTarget.files![0];
                                formik.setFieldValue('resume', file);
                            }}
                        />
                        {formik.touched.resume && formik.errors.resume ? <div>{formik.errors.resume}</div> : null}
                    </div>
                    <div>
                        <label>Select Agency</label>
                        {loadingAgencies ? (
                            <p>Loading agencies...</p>
                        ) : (
                            <select {...formik.getFieldProps('agencyId')}>
                                <option value="">Select an agency</option>
                                {agencies.map((agency) => (
                                    <option key={agency.id} value={agency.id}>
                                        {agency.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {formik.touched.agencyId && formik.errors.agencyId ? <div>{formik.errors.agencyId}</div> : null}
                    </div>
                </>
            )}
            <button type="submit">Register</button>
            {message && <div>{message}</div>}
        </form>
    );
};

export default RegisterForm;
