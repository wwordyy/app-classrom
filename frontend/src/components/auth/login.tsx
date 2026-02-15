import { useState } from 'react';
import logoClassrom from '../../assets/icons/logoClassrom.png'

import { ApiLogin } from '../../api/auth/login'
import { useNavigate } from 'react-router-dom';

export  function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, sestLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        setError("");
        sestLoading(true);


        const dataToSent = {
            email: email.trim(),
            password: password.trim(),
        }

        try {  
            const response = await ApiLogin(dataToSent);
            // navigate("/home")

            console.log(response)

        } catch (e: any) {
            setError(e.message);

        } finally {
            sestLoading(false)
        }



    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-black rounded-3xl px-16 py-12 flex gap-16 items-start shadow-xl w-full max-w-5xl">
            <div className="space-y-6 max-w-md pt-4">
            <div className="w-10 h-10  flex items-center 
                                        justify-center text-xl font-bold text-blue-500">
                <img src={logoClassrom} alt="" />
            </div>
            
            <h1 className="text-4xl font-medium text-white leading-tight">
                Войти в аккаунт
            </h1>
            <p className="text-lg text-gray-300">
                Укажите, ваши данные.
            </p>
            </div>

                

            <form onSubmit={handleSubmit} className="flex-1 space-y-6">

            <div className="h-12">
                    {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-100 text-sm h-full flex items-center">
                        {error}
                    </div>
                    )}
                </div>


            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm text-gray-400">
                    Email
                </label>
                <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-[#3c4043] rounded-md px-3 
                                    py-3 text-white text-base focus:outline-none focus:border-white 
                                    focus:ring-1 focus:ring-white"
                />
            </div>

            
            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm text-gray-400">
                    Пароль
                </label>
                <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-[#3c4043] rounded-md px-3 py-3 
                                    text-white text-base focus:outline-none focus:border-white 
                                    focus:ring-1 focus:ring-white"
                minLength={6}/>
            </div>

                <div className="flex justify-between items-center pt-6">
                    <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-2.5 rounded-full text-sm font-medium transition-colors ${
                        loading
                        ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                        : 'bg-[#8ab4f8] text-black hover:bg-[#aecbfa]'
                    }`}
                    >
                    {loading ? 'Загрузка...' : 'Далее'}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-sm text-[#8ab4f8] hover:text-[#aecbfa] 
                                            font-medium underline transition-colors"
                    >
                    Нет аккаунта? Зарегистрироваться.
                </button>

            </form>


        </div>
        </div>
  );
}
