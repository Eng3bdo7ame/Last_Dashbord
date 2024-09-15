import Cookies from 'js-cookie';
import { User } from '@phosphor-icons/react';

const LogOut = () => {
  const handleLogOut = () => {
    Cookies.remove('token');
    window.location.href = '/';
  };

  return (
    <div title="LogOut">
      <User
        className="bg-transparent rounded-full p-1 text-gray-500 dark:hover:text-white focus:outline-none hover:text-slate-500 w-fit cursor-pointer"
        size={32}
        onClick={handleLogOut}
      />
    </div>
  );
};

export default LogOut;
