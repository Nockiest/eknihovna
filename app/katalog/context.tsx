import { Book, Filters  } from "@/types/types";
import { useContext,createContext } from "react";


type QueryContextType = {
  isOpenSearcher: boolean;
  setOpenSearcher: React.Dispatch<React.SetStateAction<boolean>>;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  genres: string[] | Promise<string[]>
};

// Create the context
export const SearchContext = createContext<QueryContextType | undefined>(
  undefined
);

// Custom hook to use the SearchContext
export const useSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "useSearchContext must be used within a SearchContextProvider"
    );
  }

  return context;
};
// const [results, setResults] = useState<SearchCategory[]>([
//   {
//     id: 1,
//     keyword: "apple",
//     boundValues: [
//       // { value: "apple juice", popularity: 45 },
//       // { value: "apples", popularity: 0 },
//       { value: "apple  Iphone", popularity: 100 },
//       // { value: "best apples", popularity: 0 },
//     ],
//     popularity: 45,
//   },
//   {"id":1,"keyword":"ultrices","boundValues":[{"popularity":90,"value":" pellentesque quisque porta volutpat erat quisque ultrices imperdiet et commodo vulputate justo in blandit ultrices enim lorem ipsum"},{"popularity":32,"value":"rhoncus sed vestibulum sit amet cursus id turpis integer aliquet massa id lobortis convallis tortor risus dapibus augue ultrices justo in hac habitasse platea dictumst etiam faucibus cursus urna ut tellus nulla"},{"popularity":44,"value":"et ultrices posuere cubilia curae duis faucibus accumsan odio curabitur convallis duis consequat dui nec nisi volutpat eleifend ultrices convallis tortor risus dapibus augue vel accumsan tellus nisi eu orci mauris lacinia sapien quis libero nullam sit"},{"popularity":6,"value":"turpis donec posuere metus vitae ipsum aliquam non mauris morbi non ultrices ultrices enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum mauris non ligula pellentesque ultrices"},{"popularity":33,"value":"amet erat nulla tempus vivamus in felis eu sapien cursus vestibulum proin eu ultrices amet sem fusce consequat nulla nisl nunc nisl duis bibendum felis sed interdum venenatis turpis"}],"popularity":93},
//   {"id":2,"keyword":"augue","boundValues":[{"popularity":82,"value":"  justo morbi ut odio cras mi augue nulla quisque arcu libero rutrum ac lobortis vel dapibus at diam"},{"popularity":61,"value":"accumsan tellus nisi eu orci mauris lacinia sapien quis libero nullam sit amet turpis augue vel enim sit amet nunc viverra dapibus nulla suscipit ligula in lacus curabitur at ipsum ac"},{"popularity":95,"value":"sed nisl nunc rhoncus dui vel sem sed sagittis nam congue risus semper porta volutpat quam pede lobortis augue rhoncus aliquam lacus morbi quis tortor id nulla ultrices aliquet maecenas leo odio condimentum id"},{"popularity":54,"value":"molestie sed justo pellentesque viverra pede ac diam cras pellentesque volutpat dui maecenas tristique est et tempus augue turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem duis aliquam convallis"}],"popularity":54},
//   {"id":3,"keyword":"nulla","boundValues":[{"popularity":38,"value":"nulla    nullam varius nulla facilisi nulla in faucibus orci luctus et ultrices posuere cubilia curae nulla dapibus dolor vel est donec odio justo sollicitudin ut"},{"popularity":61,"value":"at velit eu est congue elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis diam nulla vivamus vel nulla eget eros elementum pellentesque quisque porta volutpat"},{"popularity":28,"value":"vitae ipsum aliquam non mauris morbi non lectus aliquam sit amet diam nulla quisque ut erat curabitur gravida nisi at nibh in hac habitasse platea"},{"popularity":75,"value":"orci eget orci vehicula condimentum curabitur in libero ut massa volutpat convallis morbi odio nulla sapien a libero nam dui proin leo odio porttitor id consequat in consequat ut"}],"popularity":79},
//   {"id":4,"keyword":"nam","boundValues":[{"popularity":71,"value":"lorem id ligula suspendisse ornare consequat lectus in est risus auctor nam vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi quis"},{"popularity":41,"value":"non velit donec diam neque vestibulum eget vulputate ut ultrices vel augue vestibulum nam sem duis aliquam convallis nunc proin at turpis a pede posuere nonummy integer non velit donec diam neque"},{"popularity":11,"value":"tellus semper interdum mauris ullamcorper purus sit amet nulla quisque arcu libero rutrum ac nam faucibus accumsan odio curabitur convallis duis consequat dui nec nisi"},{"popularity":47,"value":"interdum mauris non ligula pellentesque ultrices phasellus id sapien in nam justo nec condimentum neque sapien placerat ante nulla justo aliquam quis turpis eget elit sodales scelerisque mauris sit amet eros"}],"popularity":4},
//   {"id":5,"keyword":"in","boundValues":[{"popularity":15,"value":"consequat in consequat ut nulla sed accumsan felis ut at dolor quis odio consequat varius integer ac leo pellentesque ultrices in nisi at nibh in hac habitasse platea dictumst aliquam augue quam sollicitudin"},{"popularity":14,"value":"donec vitae nisi nam ultrices libero non mattis pulvinar nulla pede ullamcorper augue a in eros vestibulum ac est lacinia nisi venenatis tristique fusce congue diam id ornare imperdiet sapien urna pretium nisl"}],"popularity":94},
//   {"id":6,"keyword":"dolor","boundValues":[{"popularity":29,"value":"quam nec dui luctus rutrum nulla tellus in sagittis dui vel nisl duis ac nibh fusce lacus purus dolor non velit donec diam neque vestibulum eget vulputate ut ultrices vel"},{"popularity":69,"value":"lectus in quam fringilla rhoncus mauris enim leo rhoncus sed vestibulum sit amet cursus id dolor mi sit amet lobortis sapien sapien non mi integer ac neque"}],"popularity":40},
//   {"id":7,"keyword":"pede","boundValues":[{"popularity":58,"value":"vivamus tortor duis mattis egestas metus aenean fermentum donec ut mauris eget massa tempor pede risus auctor sed tristique in tempus sit amet sem fusce consequat nulla nisl nunc nisl duis bibendum"},{"popularity":77,"value":"mauris laoreet ut rhoncus aliquet pulvinar sed nisl nunc rhoncus pede turpis a pede posuere nonummy integer non velit donec diam neque vestibulum eget vulputate ut ultrices vel augue"}],"popularity":75},
//   {"id":8,"keyword":"nisi","boundValues":[{"popularity":2,"value":"eget orci vehicula condimentum curabitur in libero ut massa volutpat convallis nisi posuere cubilia curae mauris viverra diam vitae quam suspendisse potenti nullam porttitor lacus at turpis donec"},{"popularity":44,"value":"nascetur ridiculus mus vivamus vestibulum sagittis sapien cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus nisi congue eget semper rutrum nulla nunc purus phasellus in felis donec semper sapien"},{"popularity":1,"value":"risus auctor sed tristique in tempus sit amet sem fusce nisi amet cursus id turpis integer aliquet massa id lobortis convallis tortor risus dapibus"}],"popularity":63},
//   {"id":9,"keyword":"habitasse","boundValues":[{"popularity":99,"value":"et ultrices posuere cubilia curae nulla dapibus dolor vel est donec odio habitasse parturient montes nascetur ridiculus mus vivamus vestibulum sagittis sapien cum sociis natoque penatibus et magnis"},{"popularity":23,"value":"facilisi cras non velit nec nisi vulputate nonummy maecenas tincidunt lacus at velit vivamus vel nulla eget habitasse id lobortis convallis tortor risus dapibus augue vel accumsan tellus"}],"popularity":26},
