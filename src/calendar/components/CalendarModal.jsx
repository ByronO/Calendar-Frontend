import { useEffect, useMemo, useState } from 'react';
import { addHours, differenceInSeconds } from 'date-fns';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


import Modal from 'react-modal';
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

import { useCalendarStore, useUiStore } from '../../hooks';

// *** Spanish ***
//import es from 'date-fns/locale/es';

// *** Spanish ***
//registerLocale('es', es);

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {

  const { isDateModalOpen, closeDateModal} = useUiStore();

  const { activeEvent, startSavingEvent } = useCalendarStore();
  //const [isOpen, setIsOpen] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formValues, setFormValues] = useState({
    title: '',
    notes: '',
    start: new Date(),
    end: addHours (new Date(), 2),
  });

  const titleClass = useMemo ( () => {
    if (!formSubmitted) return '';

    return ( formValues.title.length > 0 )
      ? ''
      : 'is-invalid';

  }, [ formValues.title, formSubmitted])

  useEffect(() => {
    if ( activeEvent !== null ) {
      setFormValues( {...activeEvent});
    }
  }, [ activeEvent ])

  const onInputChange = ({target}) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    })
  }

  const onDateChange = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event
    })
    
  }
  const onCloseModal = () => {
    console.log('close modal');
    closeDateModal();
    //setIsOpen(false);
  }


  const onSubmit = async( event) => {
    //stop propagation, doesn't refresh the window when selecting save
    event.preventDefault();
    setFormSubmitted(true);

    const difference = differenceInSeconds(formValues.end, formValues.start);
    if ( isNaN(difference) || difference <= 0 ){
      console.log('Error in Dates');
      Swal.fire('Incorrect dates', 'Check the dates entered', 'error');
      return;
    }

    if( formValues.title.length <= 0) return;

    console.log(formValues);

    await startSavingEvent( formValues );
    closeDateModal();
    setFormSubmitted(false);
    
  }

  return (
    <Modal
      isOpen={ isDateModalOpen }
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-background"
      closeTimeoutMS={200}
    >
      <h1> New event </h1>
      <hr />
      <form className="container" onSubmit={ onSubmit }>

        <div className="form-group mb-2">
          <label>Start date and time</label>
          <DatePicker
            selected={formValues.start}
            onChange={(event) => onDateChange(event, 'start')}
            className="form-control"
            dateFormat="Pp"
            showTimeSelect
            // *** Spanish ***
            // locale={'es'}
            // timeCaption='Hora'
          />
        </div>

        <div className="form-group mb-2">
          <label>End date and time</label>
          <DatePicker
            minDate={formValues.start}
            selected={formValues.end}
            onChange={(event) => onDateChange(event, 'end')}
            className="form-control"
            dateFormat="Pp"
            showTimeSelect
            // *** Spanish ***
            // locale={'es'}
            // timeCaption='Hora'
          />
        </div>

        <hr />
        <div className="form-group mb-2">
          <label>Title and notes</label>
          <input
            type="text"
            className={`form-control ${titleClass}`}
            placeholder="Event Title"
            name="title"
            autoComplete="off"
            value={formValues.title}
            onChange={onInputChange}
            
          />
          <small id="emailHelp" className="form-text text-muted">A short description</small>
        </div>

        <div className="form-group mb-2">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notes"
            rows="5"
            name="notes"
            value={formValues.notes}
            onChange={onInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">Additional information</small>
        </div>

        <button
          type="submit"
          className="btn btn-outline-primary btn-block"
        >
          <i className="far fa-save"></i>
          <span> Save </span>
        </button>

      </form>

    </Modal>
  )
}
