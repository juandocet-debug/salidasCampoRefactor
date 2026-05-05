import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QrEstudiantesModal = ({ salida, onCerrar }) => {
    // Generar una URL base temporal. En el futuro apuntará al módulo de estudiante real.
    const urlAbordaje = `${window.location.origin}/estudiante/unirse?salidaId=${salida.id}`;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
            <div style={{
                background: '#fff', borderRadius: '16px', padding: '32px',
                width: '100%', maxWidth: '400px', textAlign: 'center',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                animation: 'fadeInUp 0.3s ease-out'
            }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '20px', fontWeight: 'bold' }}>
                    Código QR de Abordaje
                </h3>
                <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '14px' }}>
                    Pide a los estudiantes que escaneen este código para unirse a la salida <strong>{salida.nombre}</strong>.
                </p>

                <div style={{ 
                    background: '#f8fafc', padding: '24px', borderRadius: '12px', 
                    display: 'flex', justifyContent: 'center', marginBottom: '24px',
                    border: '1px solid #e2e8f0'
                }}>
                    <QRCodeCanvas 
                        value={urlAbordaje} 
                        size={200}
                        bgColor={"#ffffff"}
                        fgColor={"#0f172a"}
                        level={"H"}
                        includeMargin={false}
                    />
                </div>

                <div style={{ marginBottom: '24px', padding: '12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '12px', color: '#475569', wordBreak: 'break-all' }}>
                    <strong>Enlace alternativo:</strong><br/>
                    <a href={urlAbordaje} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                        {urlAbordaje}
                    </a>
                </div>

                <button 
                    onClick={onCerrar}
                    style={{
                        width: '100%', padding: '12px', background: '#0f172a', color: '#fff',
                        border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold',
                        cursor: 'pointer', transition: 'background 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#334155'}
                    onMouseOut={e => e.currentTarget.style.background = '#0f172a'}
                >
                    Cerrar
                </button>
            </div>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default QrEstudiantesModal;
