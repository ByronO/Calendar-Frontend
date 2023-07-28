import { addHours, differenceInSeconds } from 'date-fns';
import { useState } from 'react';

import Modal from 'react-modal';
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
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

  const [isOpen, setIsOpen] = useState(true);

  const [formValues, setFormValues] = useState({
    title: 'Monthly  Meeting',
    notes: 'Meeting with all members of the development department',
    start: new Date(),
    end: addHours (new Date(), 2),
  });

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
    setIsOpen(false);
  }


  const onSubmit = ( event) => {
    //stop propagation, doesn't refresh the window when selecting save
    event.preventDefault();

    const difference = differenceInSeconds(formValues.end, formValues.start);
    if ( isNaN(difference) || difference <= 0 ){
      console.log('Error in Dates');
      return;
    }

    if( formValues.title.length <= 0) return;

    console.log(formValues);

    //close modal
    //remove errors

    
  }

  return (
    <Modal
      isOpen={isOpen}
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
            className="form-control"
            placeholder="Título del evento"
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
            placeholder="Notas"
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
