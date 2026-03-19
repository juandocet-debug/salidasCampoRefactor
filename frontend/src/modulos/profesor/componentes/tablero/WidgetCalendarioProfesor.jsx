import React from 'react';
import './WidgetCalendarioProfesor.css';

const WidgetCalendarioProfesor = () => {
    return (
        <div className="widget-calendario">
            <div className="widget-calendario__header">
                <span>Nov 2026</span>
                <div className="widget-calendario__nav">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
            </div>
            <div className="widget-calendario__dias">
                <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
            </div>
            <div className="widget-calendario__grid">
                <div></div><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>
                <div>7</div><div>8</div><div className="widget-calendario__dia widget-calendario__dia--activo">9</div><div className="widget-calendario__dia widget-calendario__dia--rango">10</div><div className="widget-calendario__dia widget-calendario__dia--rango">11</div><div className="widget-calendario__dia widget-calendario__dia--rango">12</div><div className="widget-calendario__dia widget-calendario__dia--activo">13</div>
                <div>14</div><div>15</div><div>16</div><div>17</div><div>18</div><div>19</div><div>20</div>
                <div>21</div><div>22</div><div>23</div><div>24</div><div>25</div><div>26</div><div>27</div>
                <div>28</div><div>29</div><div>30</div>
            </div>
        </div>
    );
};

export default WidgetCalendarioProfesor;
