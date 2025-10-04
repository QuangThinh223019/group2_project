let users = []; // mảng tạm để lưu user

// GET /users
exports.getUsers = (req, res) => {
    res.json(users);
};

// POST /users
exports.createUser = (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };
    users.push(newUser);
    res.status(201).json(newUser);
};

// PUT /users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.email !== undefined) updates.email = req.body.email;

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'User không tồn tại' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User không tồn tại' });

    res.json({ message: 'Đã xóa user', id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
};
