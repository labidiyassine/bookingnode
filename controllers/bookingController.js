const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    const { room, date, startTime, endTime } = req.body;
    try {
        const conflictingBooking = await Booking.findOne({
            room,
            date,
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } }
            ]
        });

        if (conflictingBooking) {
            return res.status(400).json({ msg: 'Room is already booked for this time slot' });
        }

        const newBooking = new Booking({
            user: req.user.id,
            room,
            date,
            startTime,
            endTime
        });
        const booking = await newBooking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('room');
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateBooking = async (req, res) => {
    const { id } = req.params;
    const { room, date, startTime, endTime } = req.body;
    try {
        let booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        const conflictingBooking = await Booking.findOne({
            room,
            date,
            _id: { $ne: id },  
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } }
            ]
        });

        if (conflictingBooking) {
            return res.status(400).json({ msg: 'Room is already booked for this time slot' });
        }

        booking.room = room;
        booking.date = date;
        booking.startTime = startTime;
        booking.endTime = endTime;

        await booking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteBooking = async (req, res) => {
    const { id } = req.params;
    try {
        let booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        await Booking.findByIdAndDelete(id);
        res.json({ msg: 'Booking removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

