import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ className, alt = 'Logo Kementerian Perhubungan', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo.png"
            alt={alt}
            className={`object-contain ${className || ''}`}
            {...props}
        />
    );
}
