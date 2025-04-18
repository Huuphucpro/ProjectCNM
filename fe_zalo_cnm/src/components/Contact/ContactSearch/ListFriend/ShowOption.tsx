import { Dialog, DialogContent } from '@material-ui/core'
import React from 'react'

interface Option {
    open: boolean,
    handleClose: () => void
}
const ShowOption = ({ open, handleClose }: Option) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>

            </DialogContent>
        </Dialog>
    )
}

export default ShowOption
