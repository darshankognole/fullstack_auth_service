import useAuth from '@/auth/store';
import { refreshToken } from '@/services/AuthService';
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

function OAuthSuccess() {
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const changeLocalLoginData = useAuth((state)=> state.changeLocalLoginData);
    const navigate = useNavigate();
    useEffect(() => {
        async function getAccessToken(){
            if(isRefreshing) {
                return;
            }

            setIsRefreshing(true);
            try{
                const responseLoginData = await refreshToken();
                changeLocalLoginData(
                    responseLoginData.accessToken,
                    responseLoginData.userdto,
                    true,
                    false
                );

                toast.success("Login success!");
                navigate('/dashboard', { replace: true });
            } catch(error) {
                toast.error("Error while login!");
                console.log(error);
            } finally {
                setIsRefreshing(false);
            }
        }

        void getAccessToken();
    }, [changeLocalLoginData, isRefreshing, navigate])

  return (
    <div>OAuthSuccess</div>
  )
}

export default OAuthSuccess;
