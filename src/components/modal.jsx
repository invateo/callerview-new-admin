import Modal from "react-modal";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";
import "../index.css";

export const CustomModal = ({
  children,
  headerTitle,
  modalIsOpen,
  afterOpenModal,
  closeModal,
  shortModal,
  classes
}) => {
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={{marginTop: "-4rem"}}
        className={`postionmoal relative ${shortModal ? "deleteassets" : "Addassets"} ${classes}`}
        overlayClassName={"GeneralOverlay"}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className={`modal-header flex justify-between items-center ${shortModal ? "" : "footed"}`}>
              <h2 className="font-medium text-lg mr-auto">{headerTitle}</h2>
              <div onClick={closeModal} className="cursor-pointer">
                <CloseIcon />
              </div>
            </div>
            {children}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const ConfirmModal = ({
  deleteAction,
  headerTitle,
  modalIsOpen,
  afterOpenModal,
  closeModal,
}) => {
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={{marginTop: "-4rem"}}
        className={"deleteassets postionmoal relative"}
        overlayClassName={"GeneralOverlay"}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header flex justify-between items-center">
              <h2 className="font-medium text-lg mr-auto">Delete {headerTitle}</h2>
              <div onClick={closeModal} className="cursor-pointer">
                <CloseIcon />
              </div>
            </div>
            <div className="modal-body p-0">
              <div className="p-5 text-center">
                <i
                  data-feather="x-circle"
                  className="w-16 h-16 text-theme-12 mx-auto mt-3"
                ></i>
                <div className="text-gray-600 mt-2">Are you sure you want to delete this {headerTitle.toLowerCase()}?</div>
              </div>
              <div className="px-5 pb-8 text-center">
                <div onClick={deleteAction} className="btn w-24 btn-primary mr-4">
                  Confirm
                </div>
                <div onClick={closeModal} className="btn w-24 btn-secondary">
                  Cancel
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
