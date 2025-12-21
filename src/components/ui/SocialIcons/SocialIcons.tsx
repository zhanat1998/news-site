import styles from "./SocialIcons.module.scss";
import {socialLinks} from "@/constants";
import {SocialIcon} from "@/components/ui/SocialIcons/components/SocialIcon/SocialIcon";

const SocialIcons = () => {
  return (
    <div className={styles.socialIcons}>
      {socialLinks.map((social) => (
        <a
          key={social.icon}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <SocialIcon name={social.icon} />
        </a>
      ))}
    </div>
  )
}
export default SocialIcons;