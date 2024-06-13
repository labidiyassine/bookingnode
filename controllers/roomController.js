const Room = require('../models/Room');

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.createRoom = async (req, res) => {
    const { name, capacity, amenities } = req.body;
    try {
        const newRoom = new Room({
            name,
            capacity,
            amenities
        });

        const room = await newRoom.save();
        res.json(room);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateRoom = async (req, res) => {
    const { id } = req.params;
    const { name, capacity, amenities } = req.body;
    try {
        let room = await Room.findById(id);
        if (!room) return res.status(404).json({ msg: 'Room not found' });

        room.name = name;
        room.capacity = capacity;
        room.amenities = amenities;

        await room.save();
        res.json(room);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        let room = await Room.findById(id);
        if (!room) return res.status(404).json({ msg: 'Room not found' });

        await Room.findByIdAndDelete(id); 
        res.json({ msg: 'Room removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

