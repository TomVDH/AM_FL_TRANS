import React from 'react';

interface VideoButtonProps {
  className?: string;
}

const VideoButton: React.FC<VideoButtonProps> = ({ className = '' }) => {
  const handleVideoClick = () => {
    // Open video link in new tab
    window.open('https://vimeo.com/880909581/c40dfa73d0?turnstile=0.wHh5mjK2RgEbj2DkiV0eUlImuK-XXysG2o9pNCR4_9MJdRjz3bPXktdXlZI3NJHnGNV8_paV4NsRmT86udLWzCtWr2jIYqwsaetIhP9tqXkXXbGSibLvaO8hnyg-slFcAplKVnioHupdxKOuL7AFLAcbUPf-tEhvJT_cIhFCl3H6U2I5jFG7kAqQaxl8lvMTDUzSQFj2VIkye_eswdaw8HNY_mnnStceahh4DjBu-nJWBIq3U-u4hE1wcz97tlUi8dxwYmDle8CBaqCRN1wHZ1-15s2BmESYcZd5hHr9-RAw5q7rETpidyu90pzMQyC7DhkEseuJ69DqRkvw6cBYJLp2kUj9AF4K_yB8hBUd5TfNnSqs4MOf_ZaWAb86_KxJPSEF2_iKct4sMcPt4w4nT_J8MD_uyc4Ou-xWUbBfS-9OV1-QGLoZy9lsGx3d0t67r4_cVHimH4DCASB2Z-zW3O0yNUoiIdVbyLPirGAEUizzEIZoCdr1CosgfyKr2s4N_lfRH2G7B7-iKCFgW5M67OtlsSTmfazHX67LS6Quph-WBdwq-hYQhjVPih_t5CJjX0q6trXlPF5hHA3kP10WXW1F9_mtqEjBpUei723mrS62S4vRi-0xQskTB5DdzRvqWb4jbYnXdGtQrXOnhKAls9avWpBKyE-F6KfO6PKroL-XMmcSYGzQyQdYK7B7tEtMyhbDK1AR1ID8uYb0lEp4s6rtrvNfCOp99nxdDTOS6gE8ydQZRAbEpteGK5N_YtOSOrqu4xMFqzOWqnWpemy8u2vLRUC8Xj1mbqVQWN2aWxLEl0PQMLi1cBO6CV0UvEfaEnr6T9zIiiPWIKWMEJe7RR1wkcY2xgxn21KWotn4aO_OQYfrdb-YaOi3bESd7iYcncbi1p-vYaJ11JyblAGyPRksPkETAR3RroQ81alhrSw.8llo4LnsrEsqbsAEyTvJNA.31782df84dcb17fe8212ab084230852d496006c83cd74c63fec0b99d95f6d1f6', '_blank');
  };

  return (
    <button
      onClick={handleVideoClick}
      className={`group relative h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 ease-out overflow-hidden ${className}`}
      title="Watch Video Tutorial"
      aria-label="Watch Video Tutorial"
      style={{ borderRadius: '3px' }}
    >
      <svg
        className="w-4 h-4 relative z-10"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M8 5v14l11-7z"/>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" style={{ borderRadius: '3px' }} />
    </button>
  );
};

export default VideoButton; 