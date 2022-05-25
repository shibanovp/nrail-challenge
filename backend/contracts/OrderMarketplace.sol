// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract OrderMarketplace {
    enum OrderState {
        Created,
        Confirmed,
        Cancelled
    }

    struct OrderItem {
        string id;
        uint256 amount;
    }
    struct Order {
        uint256 id;
        OrderItem[] items;
        address customer;
        OrderState state;
    }
    address payable private owner;

    mapping(uint256 => Order) private orders;

    uint256 private orderCount;

    /// Only owner has an access
    error OnlyOwner();

    /// Order has invalid state
    error OrderInvalidState();

    constructor() {
        setContractOwner(msg.sender);
    }

    modifier onlyOwner() {
        if (msg.sender != getContractOwner()) {
            revert OnlyOwner();
        }
        _;
    }

    receive() external payable {}

    function createOrder(OrderItem[] calldata items) external payable {
        uint256 id = orderCount++;
        orders[id].id = id;
        orders[id].customer = msg.sender;
        for (uint256 i = 0; i < items.length; i++) {
            orders[id].items.push(items[i]);
        }
        orders[id].state = OrderState.Created;
    }

    function confirmOrder(uint256 index) external onlyOwner {
        require(index < orderCount, "Index out of bounds");

        if (orders[index].state != OrderState.Created) {
            revert OrderInvalidState();
        }
        Order storage order = orders[index];
        order.state = OrderState.Confirmed;
    }

    function cancelOrder(uint256 index) external onlyOwner {
        require(index < orderCount, "Index out of bounds");

        if (orders[index].state != OrderState.Created) {
            revert OrderInvalidState();
        }

        Order storage order = orders[index];
        order.state = OrderState.Cancelled;
    }

    function withdraw(uint256 amount) external onlyOwner {
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdraw failed");
    }

    function selfDestruct() external onlyOwner {
        selfdestruct(owner);
    }

    function traceOrdersByProductId(string memory id)
        external
        view
        returns (Order[] memory)
    {
        Order[] memory result = new Order[](getTracedByIdMatchCount(id));
        uint256 matchCount = 0;
        for (uint256 i = 0; i < orderCount; i++) {
            for (uint256 j = 0; j < orders[i].items.length; j++) {
                bool isEquals = keccak256(bytes(orders[i].items[j].id)) ==
                    keccak256(bytes(id));
                if (isEquals) {
                    result[matchCount++] = orders[i];
                }
            }
        }
        return result;
    }

    function getOrderById(uint256 id) external view returns (Order memory) {
        require(id < orderCount, "Index out of bounds");

        return orders[id];
    }

    function getOrderCount() external view returns (uint256) {
        return orderCount;
    }

    function getContractOwner() public view returns (address) {
        return owner;
    }

    function getTracedByIdMatchCount(string memory id)
        internal
        view
        returns (uint256)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < orderCount; i++) {
            for (uint256 j = 0; j < orders[i].items.length; j++) {
                bool isEquals = keccak256(bytes(orders[i].items[j].id)) ==
                    keccak256(bytes(id));
                if (isEquals) {
                    count++;
                }
            }
        }
        return count;
    }

    function setContractOwner(address newOwner) private {
        owner = payable(newOwner);
    }
}
