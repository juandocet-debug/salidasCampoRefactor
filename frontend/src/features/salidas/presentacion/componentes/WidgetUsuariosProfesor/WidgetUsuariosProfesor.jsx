import React from 'react';
import './WidgetUsuariosProfesor.css';

const WidgetUsuariosProfesor = () => {
    return (
        <div className="widget-usuarios">
            <div className="widget-usuarios__header">
                <span>Estudiantes Inscritos</span>
                <span className="widget-usuarios__ver-todos">Ver todos</span>
            </div>

            <div className="lista-usuarios">
                <div className="user-item">
                    <div className="user-item__avatar"><img src="https://i.pravatar.cc/150?img=32" alt="Avatar" /></div>
                    <div className="user-item__info">
                        <div className="user-item__nombre">Maren Maureen</div>
                        <div className="user-item__id">202014589</div>
                    </div>
                    <div className="user-item__estado"></div>
                </div>

                <div className="user-item">
                    <div className="user-item__avatar"><img src="https://i.pravatar.cc/150?img=40" alt="Avatar" /></div>
                    <div className="user-item__info">
                        <div className="user-item__nombre">Jenniffer Jane</div>
                        <div className="user-item__id">202118492</div>
                    </div>
                    <div className="user-item__estado"></div>
                </div>

                <div className="user-item">
                    <div className="user-item__avatar"><img src="https://i.pravatar.cc/150?img=11" alt="Avatar" /></div>
                    <div className="user-item__info">
                        <div className="user-item__nombre">Ryan Herwinds</div>
                        <div className="user-item__id">201948572</div>
                    </div>
                    <div className="user-item__estado" style={{ background: '#cbd5e1' }}></div>
                </div>

                <div className="user-item">
                    <div className="user-item__avatar"><img src="https://i.pravatar.cc/150?img=49" alt="Avatar" /></div>
                    <div className="user-item__info">
                        <div className="user-item__nombre">Kierra Culhane</div>
                        <div className="user-item__id">202213495</div>
                    </div>
                    <div className="user-item__estado"></div>
                </div>
            </div>
        </div>
    );
};

export default WidgetUsuariosProfesor;
