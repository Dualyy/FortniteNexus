import { useTheme } from '../ThemeContext';
import { UserDataType } from '../types/UserDataType';

export default function Profile(props: {onDelete: () => void , id: string,
   whatUser: string,
    profileClass: string,
     orientation: string, whatUserData: UserDataType | null}) {
  const level = props.whatUserData?.battlePass?.level ?? "N/A";
  const progress = props.whatUserData?.battlePass?.progress ?? "N/A";
  const { isDarkMode } = useTheme();

  return (
    <div className={`skeleton-card profile-container ${isDarkMode ? 'dark-mode' : ''}`}>
 <div className={`${props.profileClass}`}>
      <div className={`profile-avatar profile-info--${props.orientation} ${isDarkMode ? 'dark-mode' : ''}`}>
        <img
          className="profile-image"
          src={props.whatUserData?.image}
          alt="Profile"
        />
      </div>
      <div className={`profile-info ${isDarkMode ? 'dark-mode' : ''}`}>
        <h2>{props.whatUser}</h2>
        <hr />
        <p>Level: {level}</p>
        <p>Progress: {progress}%</p>
        <button className={'delete-button'} id={props.id} onClick={() => props.onDelete() }>Delete</button>
      </div>
    </div>
    </div>
  );
}