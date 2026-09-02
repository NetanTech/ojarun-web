"use client";
import React, { useEffect, useRef, useState } from "react";
import BreadCrumb from "../Acomponents/bread-crumb";
import Button from "@/components/ui/Button";
import {
  AllBookmark,
  Edit,
  EllipsisVertical,
  Home,
  Minus,
  Plus,
  Search,
  ShoppingBags,
} from "../../../../public/svg/svg";
import Modal from "@/components/ui/Modal";
import Image from "next/image";
import { formatCurrency } from "../../../../lib/utils";
import { fetchProducts } from "@/lib/products";
import { useCart } from "@/lib/cart";
import {
  fetchShoppingLists,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
} from "@/lib/shoppingLists";
import { SuccessIcon } from "../../../../public/svg/AnimatedSvgs/fun-svg";

const Empty = ({ onCreate }: { onCreate: () => void }) => {
  return (
    <div className="flex items-center justify-center w-full h-full py-10 flex-col gap-4">
      <ShoppingBags />
      <h6>No shopping list yet</h6>
      <p className="max-w-md text-grey-300 text-center body-small">
        {" "}
        Create shopping lists to easily shop items you love again, E.g Weekly
        family Shopping, end of month restock, etc.
      </p>
      <Button
        leftIcon={<Plus size={20} />}
        as="button"
        size="sm"
        variant="primary"
        onClick={onCreate}
      >
        New list
      </Button>
    </div>
  );
};

const ShoppingListCard = ({
  list,
  onEdit,
  onDelete,
}: {
  list: ShoppingList;
  onEdit?: (list: ShoppingList) => void;
  onDelete?: (list: ShoppingList) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [items, setItems] = useState(list.items);
  const [justAdded, setJustAdded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cart = useCart();

  useEffect(() => {
    setItems(list.items);
  }, [list.items]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const handleIncrement = (productId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const handleDecrement = (productId: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing && existing.quantity <= 1) {
        return prev.filter((item) => item.productId !== productId);
      }
      return prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
    });
  };

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      if (!item.productId) return;
      cart.addItem(
        {
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.imageURL,
          unit: item.more,
        },
        item.quantity,
      );
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const listTotal = items.reduce((a, b) => a + b.price * b.quantity, 0);

  return (
    <div className="px-3 py-3 border border-[#E8E8E8] shadow-[0_2px_6px_rgba(0,0,0,0.04)] rounded-2xl w-full">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <AllBookmark className="w-6 h-6 text-green-500" />
          </div>

          <p className="truncate flex-1 text-md font-semibold">
            {list.name}
          </p>
        </div>

        <button
          className="text-grey-300 p-2 hover:bg-grey-50 rounded-xl focus-within:outline-grey-50 focus-within:bg-grey-50"
          onClick={() => setShowMenu(true)}
        >
          <EllipsisVertical />
        </button>
      </div>
      <div className="mt-5 flex items-center gap-1 text-sm text-grey-300 whitespace-nowrap">
        <span>{list.items.length} ingredients</span>
        •
        <span>updated {list.updatedAt}</span>
      </div>
      <div className="mt-5 flex gap-4">
        <Button
          className="flex-1 w-full rounded-[12px]"
          as="button"
          size="lg"
          variant="primary"
          onClick={() => setShowDetails(true)}
        >
          View
        </Button>

        <div className="relative">
          <Button
            as="button"
            variant="secondary"
            size="lg"
            className="w-12 h-12 rounded-xl bg-grey-50 p-0"
            onClick={() => onEdit?.(list)}
          >
            <Edit />
          </Button>

          {showMenu && (
            <div
              className="absolute shadow flex flex-col gap-2 p-2 rounded-[8px] border border-[#E3E3E3] -bottom-3 right-0 w-[117px] bg-white"
              ref={menuRef}
            >
              <button className="hover:bg-[#F4F4F4] rounded-[4px] p-2 w-full text-start hover:text-black text-grey-400">
                Share
              </button>
              <button
                className="hover:bg-[#F4F4F4] rounded-[4px] p-2 w-full text-start hover:text-black text-grey-400"
                onClick={() => onDelete?.(list)}
              >
                Delete
              </button>
            </div>
          )}

          <Modal
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            className="w-[600px] overflow-hidden max-h-[85vh] flex flex-col"
            title={list.name}
          >
            <div
              className="flex-1 overflow-y-auto py-4 flex flex-col gap-4"
              style={{ scrollbarWidth: "thin" }}
            >
              {items.map((item) => (
                <div
                  key={item.productId || item.name}
                  className="border border-[#e7e7e7] rounded-lg w-full p-2 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 h-[70px]">
                    <div className="w-[80px] h-full rounded-lg overflow-hidden">
                      <Image
                        src={item.imageURL}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex flex-col justify-between h-full">
                      <p className="font-medium">{item.name}</p>

                      <p className="body-xsmall font-light text-grey-300">
                        {item.more}
                      </p>

                      <p className="font-medium">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 bg-primary rounded-full text-white px-4 py-3">
                    <button
                      onClick={() =>
                        item.productId && handleDecrement(item.productId)
                      }
                    >
                      <Minus size={18} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        item.productId && handleIncrement(item.productId)
                      }
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button
                as="button"
                size="sm"
                variant="primary"
                className="w-full"
                onClick={handleAddAllToCart}
              >
                {justAdded ? "Added to cart" : `Add to cart ${formatCurrency(listTotal)}`}
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingList, setEditingList] = useState<ShoppingList | null>(null);
  const [created, setCreated] = useState(false);
  const [createdListName, setCreatedListName] = useState("");
  const [listName, setListName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedItems, setAddedItems] = useState<ShoppingListItem[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [listsError, setListsError] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<ProductCardProps[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadLists = () => {
    setListsLoading(true);
    setListsError(null);
    fetchShoppingLists()
      .then(setShoppingLists)
      .catch((err) =>
        setListsError(
          err instanceof Error ? err.message : "Could not load your shopping lists.",
        ),
      )
      .finally(() => setListsLoading(false));
  };

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    fetchProducts({ search: searchQuery })
      .then(setSearchResults)
      .catch(() => setSearchResults([]))
      .finally(() => setSearchLoading(false));
  }, [searchQuery]);

  const filteredProducts = searchResults.filter(
    (p) => !addedItems.some((item) => item.productId === p.id),
  );

  const handleAddItem = (product: ProductCardProps) => {
    setAddedItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      const { id, name, price, imageURL, more } = product;
      return [...prev, { productId: id, name, price, imageURL, more, quantity: 1 }];
    });
  };

  const handleIncrement = (productId: string) => {
    setAddedItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const handleDecrement = (productId: string) => {
    setAddedItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing && existing.quantity <= 1) {
        return prev.filter((item) => item.productId !== productId);
      }
      return prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
    });
  };

  const openCreateModal = () => {
    setListName("");
    setAddedItems([]);
    setSearchQuery("");
    setSaveError(null);
    setModalMode("create");
    setEditingList(null);
  };

  const openEditModal = (list: ShoppingList) => {
    setListName(list.name);
    setAddedItems(list.items);
    setSearchQuery("");
    setSaveError(null);
    setModalMode("edit");
    setEditingList(list);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listToDelete, setListToDelete] = useState<ShoppingList | null>(null);

  const openDeleteModal = (list: ShoppingList) => {
    setListToDelete(list);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!listToDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteShoppingList(listToDelete.id);
      setShoppingLists((prev) => prev.filter((l) => l.id !== listToDelete.id));
      setShowDeleteModal(false);
      setListToDelete(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Could not delete this list. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingList(null);
    setListName("");
    setAddedItems([]);
    setSearchQuery("");
    setSaveError(null);
  };

  const handleSave = async () => {
    const items = addedItems.map((item) => ({
      productId: item.productId!,
      quantity: item.quantity,
    }));

    setSaving(true);
    setSaveError(null);
    try {
      if (modalMode === "edit" && editingList) {
        const updated = await updateShoppingList(editingList.id, {
          name: listName.trim(),
          items,
        });
        setShoppingLists((prev) =>
          prev.map((l) => (l.id === updated.id ? updated : l)),
        );
        closeModal();
      } else {
        const name = listName.trim();
        const created = await createShoppingList(name, items);
        setCreatedListName(name);
        setShoppingLists((prev) => [created, ...prev]);
        closeModal();
        setCreated(true);
      }
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not save this list. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="md:max-w-300 w-full lg:mx-auto px-4 lg:px-0 flex flex-col gap-4 mb-6 my-3">
      <BreadCrumb
        item={[
          {
            title: "Home",
            href: "/",
            icon: <Home size={18} className="text-grey-300" />,
          },
          { title: "Shopping lists", href: "/shopping-list" },
        ]}
      />

      <div className="flex flex-col gap-2 w-full items-start">
        <h6>Shopping list</h6>
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between w-full gap-3">
          <p className="text-grey-300">
            Create and reorder your favourite lists instantly
          </p>
          <Button
            leftIcon={<Plus size={20} />}
            as="button"
            size="sm"
            variant="primary"
            onClick={openCreateModal}
          >
            New list
          </Button>
        </div>
      </div>

      {listsLoading ? (
        <div className="flex items-center justify-center w-full py-10 text-grey-300">
          Loading your shopping lists...
        </div>
      ) : listsError ? (
        <div className="flex flex-col items-center justify-center w-full py-10 gap-3">
          <p className="text-red-500">{listsError}</p>
          <Button as="button" size="sm" variant="secondary" onClick={loadLists}>
            Try again
          </Button>
        </div>
      ) : shoppingLists.length === 0 ? (
        <Empty onCreate={openCreateModal} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-3">
          {shoppingLists.map((list) => (
            <ShoppingListCard
              key={list.id}
              list={list}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalMode !== null}
        onClose={closeModal}
        className="w-[600px] max-h-[85vh] flex flex-col"
        title={modalMode === "edit" ? "Edit list" : "Add new list"}
      >
        {/* Fixed Top Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="listName" className="text-grey-700 font-medium">
              List Name
            </label>

            <input
              type="text"
              id="listName"
              name="listName"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Enter list name"
              className="border border-[#e7e7e7] rounded-md px-3 py-3 w-full focus:outline-green-500"
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <label className="text-grey-700 font-medium">
              {addedItems.length > 0 ? "Added Items" : "Add Items"}
            </label>

            {addedItems.length > 0 && (
              <div
                className="max-h-[200px] overflow-y-auto py-4 w-full flex flex-col gap-4"
                style={{ scrollbarWidth: "thin" }}
              >
                <div className="flex flex-col gap-2 w-full">
                  {addedItems.map((item) => (
                    <div
                      key={item.productId || item.name}
                      className="border border-[#e7e7e7] rounded-lg w-full p-2 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 h-[70px]">
                        <div className="w-[80px] h-full rounded-lg overflow-hidden">
                          <Image
                            src={item.imageURL}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        <div className="flex flex-col justify-between h-full">
                          <p className="font-medium">{item.name}</p>

                          <p className="body-xsmall font-light text-grey-300">
                            {item.more}
                          </p>

                          <p className="font-medium">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 bg-primary rounded-full text-white px-4 py-3">
                        <button
                          onClick={() =>
                            item.productId && handleDecrement(item.productId)
                          }
                        >
                          <Minus size={18} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            item.productId && handleIncrement(item.productId)
                          }
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 border border-[#e7e7e7] p-3 rounded-md w-full">
              <Search className="text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tomatoes, rice, pepper, beef..."
                className="flex-1 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        {searchQuery.trim().length === 0 ? (
          <div className="flex gap-3 flex-col items-center justify-center py-3">
            <Search className="w-10 h-10 text-grey-300" />
            <p className="font-medium text-grey-300">
              Search items will appear here
            </p>
          </div>
        ) : (
          <div
            className="flex-1 overflow-y-auto py-4 flex flex-col gap-4"
            style={{ scrollbarWidth: "thin" }}
          >
            {searchQuery.trim() && (
              <div className="flex flex-col gap-2">
                <p className="uppercase text-grey-300 body-xsmall font-medium">
                  Results
                </p>

                {searchLoading ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-5">
                    <p className="font-medium text-grey-300">Searching...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-5">
                    <Search className="w-10 h-10 text-grey-300" />
                    <p className="font-medium text-grey-300">No items found</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-[#e7e7e7] rounded-lg w-full p-2 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 h-[70px]">
                        <div className="w-[80px] h-full rounded-lg overflow-hidden">
                          <Image
                            src={product.imageURL}
                            alt={product.name}
                            width={100}
                            height={100}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        <div className="flex flex-col justify-between h-full">
                          <p className="font-medium">{product.name}</p>

                          <p className="body-xsmall font-light text-grey-300">
                            {product.more}
                          </p>

                          <p className="font-medium">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddItem(product)}
                        className="p-4 rounded-full bg-primary text-white"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Fixed Bottom */}
        <div className="py-4 flex flex-col gap-2">
          {saveError && <p className="text-red-500 body-small">{saveError}</p>}
          <Button
            as="button"
            size="sm"
            variant="primary"
            isDisabled={!listName.trim() || addedItems.length < 2}
            isLoading={saving}
            className="w-full"
            onClick={handleSave}
          >
            {modalMode === "edit" ? "Save changes" : "Create list"}
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={created}
        onClose={() => {
          setCreated(false);
          setCreatedListName("");
        }}
        className="w-[35%]"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <SuccessIcon />
          <h5>Shopping list created</h5>
          <p className="text-grey-300 max-w-lg">
            You have successfully added{" "}
            <span className="text-black font-medium">{createdListName}</span> as
            a new shopping list
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        className="w-[35%]"
      >
        <div className="flex flex-col items-center justify-center gap-3 w-full">
          <h6>Are you sure you want to delete this list?</h6>
          <p className="text-grey-300 text-center max-w-100">
            Once deleted, this shopping list cannot be restored. You&apos;ll
            need to create a new list if you still need these items.
          </p>
          {deleteError && <p className="text-red-500 body-small">{deleteError}</p>}
        </div>
        <div className="flex items-center gap-2 w-full">
          <Button
            as="button"
            size="sm"
            variant="secondary"
            className="bg-grey-50 text-black border-none w-full"
            onClick={() => setShowDeleteModal(false)}
          >
            Keep list
          </Button>
          <Button
            as="button"
            size="sm"
            variant="primary"
            isLoading={deleting}
            className="w-full bg-red-500 text-white hover:bg-red-400"
            onClick={confirmDelete}
          >
            Delete list
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Page;
