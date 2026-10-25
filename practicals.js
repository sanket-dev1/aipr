/* ============================================================
   practicals.js - the permanent data of the app.
   Each practical has ONLY four fields, in this order:
   prNo (PR No.), title, code, theory.
   Edit in the app, click "Export practicals.js", then replace this
   file with the downloaded one and redeploy to make changes permanent.
   ============================================================ */
const practicals = [
  {
    prNo: 1,
    title: "Design and Implement a Simple Reflex Agent for the Vacuum Cleaner World and Analyze Its Rational Behavior in a Given Environment",
    code: `import java.util.ArrayList;

class Percept {
    String location;
    boolean isDirty;

    Percept(String location, boolean isDirty) {
        this.location = location;
        this.isDirty = isDirty;
    }
}

class SimpleReflexVacuumAgent {
    String location = "A";
    ArrayList<Percept> perceptSequence = new ArrayList<>();
    ArrayList<String> actions = new ArrayList<>();

    void addPercept(String location, boolean isDirty) {
        perceptSequence.add(new Percept(location, isDirty));
    }

    void addAction(String action) {
        actions.add(action);
    }

    void executeActions() {
        for (int i = 0; i < actions.size(); i++) {
            Percept p = perceptSequence.get(i);
            System.out.println("Percept: (" + p.location + ", " + p.isDirty + ") -> Action: " + actions.get(i));

            if (actions.get(i).equals("Suck")) {
                System.out.println("Vacuuming dirt.");
            } else if (actions.get(i).equals("MoveLeft")) {
                location = "A";
                System.out.println("Moving left to location A.");
            } else if (actions.get(i).equals("MoveRight")) {
                location = "B";
                System.out.println("Moving right to location B.");
            } else if (actions.get(i).equals("DoNothing")) {
                System.out.println("Doing nothing.");
            }
        }
    }
}

public class Main {
    static SimpleReflexVacuumAgent simpleReflexVacuumAgent(Percept[] perceptSequence) {
        SimpleReflexVacuumAgent agent = new SimpleReflexVacuumAgent();

        for (Percept percept : perceptSequence) {
            agent.addPercept(percept.location, percept.isDirty);
            if (percept.isDirty) {
                agent.addAction("Suck");
            } else {
                if (percept.location.equals("A")) {
                    agent.addAction("MoveRight");
                } else if (percept.location.equals("B")) {
                    agent.addAction("MoveLeft");
                }
            }
        }
        return agent;
    }

    public static void main(String[] args) {
        Percept[] perceptSequence = {
            new Percept("A", true),
            new Percept("A", false),
            new Percept("B", true),
            new Percept("B", false)
        };

        SimpleReflexVacuumAgent agent = simpleReflexVacuumAgent(perceptSequence);
        agent.executeActions();
    }
}`,
    theory: `What is an Intelligent Agent?
An intelligent agent is a system that perceives its environment through sensors and
performs actions through actuators to achieve a goal.
Basic structure:
Environment → Sensors → Agent → Actuators → Environment
For a vacuum cleaner:
 Sensors: Detect the current location and whether the floor is clean or dirty.
 Agent: Decides what action to perform.

 Actuators: Move the vacuum cleaner or perform cleaning.
 Environment: Rooms/floor locations containing clean or dirty surfaces.

Vacuum Cleaner World
Consider a simple environment containing two locations:
 Location A
 Location B
Each location can have one of two states:
 Clean
 Dirty
The vacuum cleaner can perform the following actions:
Condition Action
Current location is Dirty
- Suck
Current location is Clean and agent is at
A

- Move
Right
Current location is Clean and agent is at
B

- Move
Left

Example
Suppose the initial environment is:
Locatio
n

Statu
s
A Dirty
B Dirty
Agent starts at A.

The agent performs:
A Dirty → Suck → A Clean → Move Right → B Dirty → Suck → B Clean
Thus, the agent cleans both locations.

Simple Reflex Agent
A Simple Reflex Agent selects an action based only on the current percept.
It uses condition-action rules:
IF condition THEN action
For example:
 IF current location is dirty → Suck
 IF current location is clean and agent is at A → Move Right
 IF current location is clean and agent is at B → Move Left
The agent does not maintain a detailed history of previous states.

PEAS Description
PEAS stands for:
P – Performance Measure
E – Environment
A – Actuators
S – Sensors
Component Vacuum Cleaner Agent
Performance
Measure

Maximum cleanliness, minimum unnecessary movement,
minimum time/energy

Environment Two-room environment: A and B
Actuators Suck, Move Left, Move Right
Sensors Current location and cleanliness status

Algorithm
Algorithm: Simple Reflex Vacuum Cleaner Agent
Step 1: Start.
Step 2: Define the environment with two locations A and B.
Step 3: Set the initial position of the vacuum cleaner.
Step 4: Read the current location and its cleanliness status.
Step 5: If the current location is dirty, perform Suck.
Step 6: If the current location is clean:
 If the agent is at A, move to B.
 If the agent is at B, move to A.
Step 7: Update the environment after every action.
Step 8: Repeat the process for a specified number of steps.

Step 9: Display the actions performed and final environment.
Step 10: Stop.`
  },
  {
    prNo: 2,
    title: "A* algorithm for 8 puzzle problem",
    code: `
import java.util.*;

class PuzzleState implements Comparable<PuzzleState> {

    int[][] board;
    int g;
    int h;
    int f;
    PuzzleState parent;
    String move;

    static int[][] goal = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 0}
    };

    PuzzleState(int[][] board, int g, PuzzleState parent, String move) {
        this.board = copyBoard(board);
        this.g = g;
        this.parent = parent;
        this.move = move;
        this.h = calculateHeuristic();
        this.f = g + h;
    }

    int[][] copyBoard(int[][] b) {
        int[][] temp = new int[3][3];

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                temp[i][j] = b[i][j];
            }
        }

        return temp;
    }

    // Count misplaced tiles, excluding blank (0)
    int calculateHeuristic() {
        int count = 0;

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] != 0 &&
                    board[i][j] != goal[i][j]) {
                    count++;
                }
            }
        }

        return count;
    }

    public int compareTo(PuzzleState other) {
        return Integer.compare(this.f, other.f);
    }

    boolean isGoal() {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] != goal[i][j]) {
                    return false;
                }
            }
        }

        return true;
    }

    void printBoard() {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == 0) {
                    System.out.print("_ ");
                } else {
                    System.out.print(board[i][j] + " ");
                }
            }

            System.out.println();
        }

        System.out.println();
    }
}

public class Main1 {

    static PriorityQueue<PuzzleState> open =
        new PriorityQueue<>();

    static HashSet<String> closed = new HashSet<>();

    static String boardToString(int[][] board) {
        StringBuilder s = new StringBuilder();

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                s.append(board[i][j]);
            }
        }

        return s.toString();
    }

    // Generate all valid child states
    static void generateChildren(PuzzleState current) {

        int x = 0, y = 0;

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (current.board[i][j] == 0) {
                    x = i;
                    y = j;
                }
            }
        }

        int[] dx = {-1, 1, 0, 0};
        int[] dy = {0, 0, -1, 1};

        String[] moves = {"Up", "Down", "Left", "Right"};

        for (int k = 0; k < 4; k++) {

            int nx = x + dx[k];
            int ny = y + dy[k];

            if (nx >= 0 && nx < 3 &&
                ny >= 0 && ny < 3) {

                int[][] newBoard = current.copyBoard(current.board);

                // Move the blank tile
                newBoard[x][y] = newBoard[nx][ny];
                newBoard[nx][ny] = 0;

                String key = boardToString(newBoard);

                if (!closed.contains(key)) {
                    PuzzleState child = new PuzzleState(
                        newBoard,
                        current.g + 1,
                        current,
                        moves[k]
                    );

                    open.add(child);
                }
            }
        }
    }

    // Display the goal state
    static void printGoalState() {

        System.out.println("\n========== GOAL STATE ==========");

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (PuzzleState.goal[i][j] == 0) {
                    System.out.print("_ ");
                } else {
                    System.out.print(PuzzleState.goal[i][j] + " ");
                }
            }

            System.out.println();
        }

        System.out.println("================================\n");
    }

    // Display how the heuristic was calculated
    static void printHeuristicCalculation(PuzzleState p) {

        int count = 0;

        System.out.println("\nHeuristic Calculation h(n):");

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {

                int tile = p.board[i][j];

                if (tile != 0 &&
                    tile != PuzzleState.goal[i][j]) {

                    System.out.println(
                        "Tile " + tile +
                        " at position (" + i + ", " + j + ")" +
                        " should be " + PuzzleState.goal[i][j]
                    );

                    count++;
                }
            }
        }

        System.out.println("Total misplaced tiles = " + count);
        System.out.println("h(n) = " + count);
    }

    // Print the complete solution path and cost values
    static void printSolution(PuzzleState state) {

        Stack<PuzzleState> path = new Stack<>();

        while (state != null) {
            path.push(state);
            state = state.parent;
        }

        int step = 0;

        while (!path.isEmpty()) {

            PuzzleState p = path.pop();

            System.out.println("\n========== STEP " + step + " ==========");

            if (p.move != null) {
                System.out.println("Move: " + p.move);
            }

            System.out.println("\nCurrent Board:");
            p.printBoard();

            System.out.println("g(n) = " + p.g);
            System.out.println(
                "g(n) calculation: " + p.g +
                " move(s) from the initial state"
            );

            printHeuristicCalculation(p);

            System.out.println("\nf(n) = g(n) + h(n)");
            System.out.println(
                "f(n) = " + p.g + " + " + p.h +
                " = " + p.f
            );

            step++;
        }

        System.out.println("Solution found in " + (step - 1) + " moves.");
    }

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        // Clear previous search data
        open.clear();
        closed.clear();

        int[][] start = new int[3][3];
        boolean[] seen = new boolean[9];

        System.out.println("===== 8-PUZZLE USING A* SEARCH =====");
        System.out.println("Enter Initial Board (0 for Blank):");

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {

                int value = sc.nextInt();

                if (value < 0 || value > 8 || seen[value]) {
                    System.out.println(
                        "Invalid board! Enter each number from 0 to 8 exactly once."
                    );
                    sc.close();
                    return;
                }

                start[i][j] = value;
                seen[value] = true;
            }
        }

        PuzzleState initial = new PuzzleState(start, 0, null, null);

        open.add(initial);

        while (!open.isEmpty()) {

            PuzzleState current = open.poll();

            String currentKey = boardToString(current.board);

            if (closed.contains(currentKey)) {
                continue;
            }

            if (current.isGoal()) {

                System.out.println("\nGOAL REACHED!");

                printGoalState();
                printSolution(current);

                sc.close();
                return;
            }

            closed.add(currentKey);

            generateChildren(current);
        }

        System.out.println("Solution Not Found.");
        sc.close();
    }
}`,
    theory: `Theory:
A* algorithm:
A* is a computer algorithm that is widely used in path finding and graph traversal, the process of
plotting an efficiently traversable path between multiple points, called nodes. Noted for its
performance and accuracy, it enjoys widespread use.
The key feature of the A* algorithm is that it keeps a track of each visited node which helps in
ignoring the nodes that are already visited, saving a huge amount of time. It also has a list that holds
all the nodes that are left to be explored and it chooses the most optimal node from this list, thus
saving time not exploring unnecessary or less optimal nodes.
Here we use two lists namely ‘open list ‘and ‘closed list‘.The open list contains all the nodes that
are being generated and are not existing in the closed list and each node explored after it’s
neighboring nodes are discovered is put in the closed list and the neighbors are put in the open list
this is how the nodes expand. Each node has a pointer to its parent so that at any given point it can
retrace the path to the parent. Initially, the open list holds the start (Initial) node. The next node
chosen from the open list is based on its f score; the node with the least f score is picked up and
explored.

f-score = h-score + g-score

A* uses a combination of heuristic value (h-score: how far the goal node is) as well as the g-
score (i.e. the number of nodes traversed from the start node to current node).
Department of Computer Engineering DIT T.E

Laboratory Practice II

➢ A* Algorithm is one of the best path finding algorithms.
➢ But it does not produce the shortest path always.
➢ This is because it heavily depends on heuristics.

Algorithm:
Step 1: Start.
Step 2: Define the initial state and goal state.
Step 3: Calculate the heuristic value h(n) using Manhattan Distance.
Step 4: Set:
[
g(n)=0
]
for the initial state.
Step 5: Calculate:
[
f(n)=g(n)+h(n)
]
Step 6: Insert the initial state into the priority queue.
Step 7: Select the state with the lowest f(n).
Step 8: If the selected state is the goal state, display the solution path and stop.
Step 9: Otherwise, generate all valid states by moving the blank tile.
Step 10: Calculate g(n), h(n) and f(n) for each new state.
Step 11: Add the new states to the priority queue.
Step 12: Repeat Steps 7–11 until the goal state is reached.
Step 13: Display the sequence of moves.
Step 14: Stop.`
  },
  {
    prNo: 3,
    title: "Tower of Hanoi using State Space Search",
    code: `
import java.util.*;

public class Main {

    // Represents a move from one peg to another
    static class Action {
        int source;
        int destination;

        Action(int source, int destination) {
            this.source = source;
            this.destination = destination;
        }
    }

    // Represents a state of the three pegs
    static class State {
        ArrayList<Integer>[] pegs;

        State() {
            pegs = new ArrayList[3];

            for (int i = 0; i < 3; i++) {
                pegs[i] = new ArrayList<>();
            }
        }

        // Creates a deep copy of the state
        State copy() {
            State newState = new State();

            for (int i = 0; i < 3; i++) {
                newState.pegs[i] = new ArrayList<>(pegs[i]);
            }

            return newState;
        }

        // Compares two states
        @Override
        public boolean equals(Object obj) {
            if (this == obj) {
                return true;
            }

            if (!(obj instanceof State)) {
                return false;
            }

            State other = (State) obj;

            return Arrays.equals(pegs, other.pegs);
        }

        // Generates a hash code for the state
        @Override
        public int hashCode() {
            return Arrays.hashCode(pegs);
        }
    }

    // Represents a node in the BFS search
    static class Node {
        State state;
        ArrayList<Action> path;

        Node(State state, ArrayList<Action> path) {
            this.state = state;
            this.path = path;
        }
    }

    // Creates the initial state: all disks on Peg A
    static State getInitialState(int numDisks) {
        State state = new State();

        for (int disk = numDisks; disk >= 1; disk--) {
            state.pegs[0].add(disk);
        }

        return state;
    }

    // Creates the goal state: all disks on Peg C
    static State getGoalState(int numDisks) {
        State state = new State();

        for (int disk = numDisks; disk >= 1; disk--) {
            state.pegs[2].add(disk);
        }

        return state;
    }

    // Generates all valid next states
    static ArrayList<Map.Entry<State, Action>> getSuccessors(
            State state) {

        ArrayList<Map.Entry<State, Action>> successors =
                new ArrayList<>();

        for (int source = 0; source < 3; source++) {
            for (int target = 0; target < 3; target++) {

                if (source == target) {
                    continue;
                }

                if (state.pegs[source].isEmpty()) {
                    continue;
                }

                int movingDisk =
                        state.pegs[source].get(
                                state.pegs[source].size() - 1);

                // A larger disk cannot be placed on a smaller disk
                if (!state.pegs[target].isEmpty()
                        && state.pegs[target].get(
                                state.pegs[target].size() - 1)
                        < movingDisk) {
                    continue;
                }

                State newState = state.copy();

                newState.pegs[source].remove(
                        newState.pegs[source].size() - 1);

                newState.pegs[target].add(movingDisk);

                Action action = new Action(source, target);

                successors.add(
                        new AbstractMap.SimpleEntry<>(
                                newState, action));
            }
        }

        return successors;
    }

    // Solves Tower of Hanoi using BFS
    static ArrayList<Action> solveHanoiStateSpace(int numDisks) {

        State startState = getInitialState(numDisks);
        State goalState = getGoalState(numDisks);

        Queue<Node> queue = new LinkedList<>();
        Set<State> visited = new HashSet<>();

        queue.add(new Node(startState, new ArrayList<>()));
        visited.add(startState);

        while (!queue.isEmpty()) {

            Node current = queue.poll();

            // Check whether the goal state is reached
            if (current.state.equals(goalState)) {
                return current.path;
            }

            ArrayList<Map.Entry<State, Action>> successors =
                    getSuccessors(current.state);

            for (Map.Entry<State, Action> successor : successors) {

                State nextState = successor.getKey();
                Action action = successor.getValue();

                if (!visited.contains(nextState)) {

                    visited.add(nextState);

                    ArrayList<Action> newPath =
                            new ArrayList<>(current.path);

                    newPath.add(action);

                    queue.add(new Node(nextState, newPath));
                }
            }
        }

        return new ArrayList<>();
    }

    // Prints the solution
    static void printSolution(int numDisks,
                              ArrayList<Action> path) {

        System.out.println(
                "--- Solved Tower of Hanoi for "
                        + numDisks + " Disks ---");

        System.out.println(
                "Minimum moves required: " + path.size());

        char[] pegMap = {'A', 'B', 'C'};

        for (int i = 0; i < path.size(); i++) {

            Action action = path.get(i);

            System.out.println(
                    "Step " + (i + 1)
                            + ": Move disk from Peg "
                            + pegMap[action.source]
                            + " -> Peg "
                            + pegMap[action.destination]);
        }
    }

    // Main method
    public static void main(String[] args) {

        int disks = 3;

        ArrayList<Action> solutionPath =
                solveHanoiStateSpace(disks);

        if (solutionPath.isEmpty()) {
            System.out.println("No solution found.");
        } else {
            printSolution(disks, solutionPath);
        }
    }
}`,
    theory: `Theory:
State space search:
State-space search is a problem-solving method in which every possible configuration of a problem
is represented as a state. Operators are applied to a state to generate successor states. The search
begins at an initial state and continues until a state satisfying the goal condition is reached. A
solution is a sequence of operators that transforms the initial state into the goal state.
For the Tower of Hanoi, the state is represented by the arrangement of disks on the three pegs. A
legal move transfers the top disk from one peg to another peg only when the destination peg is
empty or its top disk is larger than the moved disk. The initial state has all disks arranged on the
source peg in decreasing order of size, and the goal state has all disks arranged on the destination
peg in the same order.
Each legal move has unit cost. Therefore, the cost of a solution is the number of moves. For n disks,
the optimal solution requires 2ⁿ − 1 moves. A state can be stored as a tuple of three stacks, for
example, ((3, 2, 1), (), ()) for three disks, where the last element of each stack is its top disk.
Problem formulation:
Initial state: All disks are placed on peg A, with the largest disk at the bottom and the smallest disk
at the top.
Goal state: All disks are placed on peg C in the same order, with pegs A and B empty.
Operators: Move the top disk from peg A, B or C to another peg whenever the move obeys the size
constraint.
Path cost: One unit for every legal disk movement.
Search strategy: Breadth-first search may be used to guarantee the shortest sequence for a finite
state space. Depth-first search with cycle checking may also be used to produce a valid solution.

Laboratory Practice II

Figure 1: Tower of Hanoi states and legal state transitions

Department of Computer Engineering DIT T.E

Laboratory Practice II

Algorithm:
Step 1: Start.
Step 2: Read the number of disks n and define the source peg, auxiliary peg and destination peg.
Step 3: Create the initial state with all n disks on the source peg.
Step 4: Define the goal test as: all disks are on the destination peg in decreasing order from bottom
to top.
Step 5: Insert the initial state into a queue and mark it as visited.
Step 6: Remove the next state from the queue.
Step 7: If the selected state satisfies the goal test, reconstruct and display the path using parent
pointers, then stop.
Step 8: Generate every ordered pair of source and destination pegs.
Step 9: For each pair, check whether the source is non-empty and the move is legal.
Step 10: Generate the successor state by moving the top disk and assign a path cost one greater than
the current state.
Step 11: If the successor has not been visited, store its parent and move information, mark it visited
and insert it into the queue.
Step 12: Repeat Steps 6–11 until the goal state is reached.
Step 13: Display the number of states explored and the complete sequence of disk movements.
Step 14: Stop.`
  },
  {
    prNo: 4,
    title: "Local Beam Search for the Travelling Salesman Problem",
    code: `
import java.util.*;

public class Main {

    // Represents a path and its total distance
    static class Path {
        ArrayList<Integer> nodes;
        int distance;

        Path(ArrayList<Integer> nodes, int distance) {
            this.nodes = nodes;
            this.distance = distance;
        }
    }

    static ArrayList<Path> beamSearch(int[][] distances, int beta) {

        ArrayList<Path> pathsSoFar = new ArrayList<>();

        pathsSoFar.add(new Path(new ArrayList<>(), 0));

        for (int idx = 0; idx < distances.length; idx++) {

            if (idx > 0) {
                System.out.println(
                        "Paths kept after tier " + (idx - 1) + ":");

                for (Path path : pathsSoFar) {
                    System.out.println(
                            path.nodes + ", Distance = " + path.distance);
                }
            }

            ArrayList<Path> pathsAtTier = new ArrayList<>();

            // Extend each existing path
            for (Path path : pathsSoFar) {

                for (int j = 0; j < distances[idx].length; j++) {

                    ArrayList<Integer> pathExtended =
                            new ArrayList<>(path.nodes);

                    pathExtended.add(j);

                    int newDistance =
                            path.distance + distances[idx][j];

                    pathsAtTier.add(
                            new Path(pathExtended, newDistance));
                }
            }

            // Sort paths by total distance in ascending order
            pathsAtTier.sort(
                    Comparator.comparingInt(path -> path.distance));

            // Keep only the best beta paths
            pathsSoFar.clear();

            int count = Math.min(beta, pathsAtTier.size());

            for (int i = 0; i < count; i++) {
                pathsSoFar.add(pathsAtTier.get(i));
            }

            System.out.println(
                    "\nPaths reduced to after tier " + idx + ":");

            // Print discarded paths
            for (int i = beta; i < pathsAtTier.size(); i++) {
                Path path = pathsAtTier.get(i);

                System.out.println(
                        path.nodes + ", Distance = " + path.distance);
            }
        }

        return pathsSoFar;
    }

    public static void main(String[] args) {

        int[][] dists = {
                {0, 10, 15, 20},
                {10, 0, 35, 25},
                {15, 35, 0, 30},
                {20, 25, 30, 0}
        };

        int beta = 2;

        ArrayList<Path> bestPaths = beamSearch(dists, beta);

        System.out.println("\nThe best paths:");

        for (Path path : bestPaths) {
            System.out.println(
                    path.nodes + ", Distance = " + path.distance);
        }
    }
}`,
    theory: `Travelling Salesman Problem:
The Travelling Salesman Problem consists of a set of cities and the distance between each pair of
cities. The objective is to find a minimum-cost Hamiltonian cycle: a tour that starts at one city,
visits every other city exactly once and returns to the starting city. The problem is computationally
difficult for large inputs, so heuristic search methods are often used to obtain good solutions in
reasonable time.
Local beam search:
Local beam search maintains k candidate states instead of a single current state. At each iteration,
successors are generated from all k candidates. The best k successors, according to the evaluation
function, become the candidates for the next iteration. In this assignment, each state is a complete
TSP tour and its cost is the total length of the closed tour. Lower cost represents a better state.
A tour can be represented as a permutation of city indices. Neighbouring tours may be generated
using swap, insertion or 2-opt operations. A 2-opt move reverses a segment of the tour and is
especially useful because it can remove crossing edges. To avoid losing the best solution found so
far, the implementation should use a global best-tour record even if a later beam contains only
inferior tours.

Problem formulation:
State: A complete permutation of all cities, with an implicit edge from the last city back to the first
city.
Initial states: k different tours generated randomly or by combining a fixed starting city with
shuffled remaining cities.
Successor function: Generate neighbouring tours using swap, insertion or 2-opt transformations.
Evaluation function: tour_cost = distance(last, first) + Σ distance(tour[i], tour[i+1]).
Selection rule: Keep the k lowest-cost unique successor tours for the next beam.
Department of Computer Engineering DIT T.E

Laboratory Practice II

Algorithm:
Step 1: Start.
Step 2: Read the city coordinates or the distance matrix, beam width k and maximum number of
iterations.
Step 3: Generate k initial tours and calculate the cost of every tour, including the return edge to the
starting city.
Step 4: Store the lowest-cost tour as the current global best tour.
Step 5: Generate neighbouring tours for every tour in the current beam using the chosen
neighbourhood operation.
Step 6: Remove duplicate tours and calculate the cost of every remaining successor.
Step 7: Sort the successors in ascending order of tour cost.
Step 8: Select the first k successors, or all remaining successors if fewer than k are available, to
form the next beam.
Step 9: Update the global best tour if the best tour in the new beam has lower cost.
Step 10: Stop if the maximum number of iterations is reached or if no improvement occurs for a
specified number of iterations.
Step 11: Otherwise, repeat Steps 5–10.
Step 12: Display the best tour, its total distance and the iteration at which it was found.
Step 13: Stop.
Suggested experiment:
Use the following six-city distance matrix, where the diagonal entries are zero and the matrix is
symmetric. City labels may be A, B, C, D, E and F.
A B C D E F
A 0 10 15 20 18 12
B 10 0 35 25 17 28
C 15 35 0 30 28 20
D 20 25 30 0 22 16
E 18 17 28 22 0 14
F 12 28 20 16 14 0
Use a beam width such as k = 4, generate at least 10 neighbours per current tour where possible,
and run the algorithm for a fixed number of iterations. Because local beam search is heuristic and
may depend on the initial beam, repeat the experiment with more than one random seed and report
the best and average tour cost.`
  },
  {
    prNo: 5,
    title: "Implement BFS for solving the 8-puzzle problem",
    code: `import java.util.*; 
public class EightPuzzleBFS { 
    static String goal = "123456780"; 
    static int[][] moves = { 
        {-1, 0},  // Up 
        {1, 0},   // Down 
        {0, -1},  // Left 
        {0, 1}    // Right 
    }; 
    static class Node { 
        String state; 
        Node parent; 
        Node(String state, Node parent) { 
            this.state = state; 
            this.parent = parent; 
        } 
    } 
    static void display(String state) { 
        for (int i = 0; i < 9; i++) { 
            if (state.charAt(i) == '0') 
                System.out.print("_ "); 
            else 
                System.out.print(state.charAt(i) + " "); 
            if (i % 3 == 2) 
                System.out.println(); 
        } 
    } 
    static void solve(String start) { 
        Queue<Node> queue = new LinkedList<>(); 
        Set<String> visited = new HashSet<>(); 
        queue.add(new Node(start, null)); 
        visited.add(start); 
        System.out.println("\nInitial State:"); 
        display(start); 
        System.out.println("\nGoal State:"); 
        display(goal); 
        while (!queue.isEmpty()) { 
            Node current = queue.poll(); 
            if (current.state.equals(goal)) { 
                System.out.println("\nSolution Found!"); 
                List<String> path = new ArrayList<>(); 
                Node temp = current; 
                while (temp != null) { 
                    path.add(temp.state); 
                    temp = temp.parent; 
                } 
                Collections.reverse(path); 
                System.out.println("\nAll Steps:"); 
                for (int i = 0; i < path.size(); i++) { 
                    System.out.println("\nStep " + i + ":"); 
                    display(path.get(i)); 
                } 
                System.out.println("Total Moves: " + (path.size() - 1)); 
                System.out.println("\nFinal Goal State:"); 
                display(current.state); 
                return; 
            } 
            int zero = current.state.indexOf('0'); 
            int x = zero / 3; 
            int y = zero % 3; 
            for (int[] move : moves) { 
                int nx = x + move[0]; 
                int ny = y + move[1]; 
                if (nx >= 0 && nx < 3 && ny >= 0 && ny < 3) { 
                    int newPos = nx * 3 + ny; 
                    char[] arr = current.state.toCharArray(); 
                    arr[zero] = arr[newPos]; 
                    arr[newPos] = '0'; 
                    String newState = new String(arr); 
                    if (!visited.contains(newState)) { 
                        visited.add(newState); 
                        queue.add(new Node(newState, current)); 
                    } 
                } 
            } 
        } 
        System.out.println("No solution found."); 
    } 
    public static void main(String[] args) { 
        Scanner sc = new Scanner(System.in); 
 
        System.out.println("Enter Initial State (use 0 for blank):"); 
        StringBuilder start = new StringBuilder(); 
        for (int i = 0; i < 9; i++) { 
            start.append(sc.nextInt()); 
        } 
        solve(start.toString()); 
        sc.close(); 
    } 
}`,
    theory: `Theory:
Breadth First Search (BFS):
Breadth First Search (BFS) is an uninformed search technique that explores a state space level
by level. It starts from the initial state and first explores all states at depth 1, then all states at
depth 2, and so on until the goal state is reached. BFS uses a queue (FIFO – First In, First Out)
to store the states that are waiting to be explored. A visited set is maintained to avoid revisiting
the same state.
For a planning problem, each state represents a possible configuration of the problem, and
each valid action generates a new state. BFS systematically explores these states until it finds a
sequence of actions that transforms the initial state into the goal state.
Key characteristics of BFS:
➢ BFS is an uninformed (blind) search technique.
➢ It explores nodes level by level.
➢ It uses a FIFO queue.
➢ It does not require a heuristic function.
➢ BFS is complete when the branching factor is finite.
➢ For unit-cost actions, BFS finds a solution with the minimum number of steps.
BFS for 8-Puzzle:
In the 8-puzzle problem, a state consists of eight numbered tiles and one blank space arranged
in a 3×3 grid. The blank tile can move up, down, left, or right whenever the move is valid. Each
valid movement produces a new state. BFS treats every valid board configuration as a node in
the search space and every blank-tile movement as an edge.
Initial state → BFS explores all possible states level by level → Goal state
The solution path is obtained by storing the parent of every newly generated state. When the
goal state is reached, the parent links are followed backward to reconstruct the sequence of
moves from the initial state to the goal state.
Algorithm:

Step 1: Start.
Step 2: Define the initial state and the goal state.
Step 3: Create an empty FIFO queue and a visited set.
Step 4: Insert the initial state into the queue and mark it as visited.
Step 5: Remove the front state from the queue.
Step 6: If the selected state is the goal state, reconstruct and display the solution path, then
stop.
Step 7: Otherwise, generate all valid successor states by moving the blank tile.
Step 8: For each successor state, check whether it has already been visited.
Step 9: If the state is not visited, mark it as visited, store its parent, and insert it at the rear of the
queue.
Step 10: Repeat Steps 5–9 until the goal state is reached or the queue becomes empty.
Step 11: If the queue becomes empty without finding the goal state, report that no solution was
found.
Step 12: Display the sequence of states/moves from the initial state to the goal state.
Step 13: Stop.`
  },
  {
    prNo: 6,
    title: "Implement DFS for Water Jug Problem",
    code: `import java.util.*; 
public class waterpr { 
    static int jug1 = 4, jug2 = 3, target = 2; 
    static Set<String> visited = new HashSet<>(); 
    static void dfs(int a, int b) { 
        String state = a + "," + b; 
        if (visited.contains(state)) 
            return; 
        visited.add(state); 
        System.out.println("(" + a + ", " + b + ")"); 
        if (a == target || b == target) { 
            System.out.println("Target reached!"); 
            System.exit(0); 
        } 
        // Fill Jug 1 
        dfs(jug1, b); 
        // Fill Jug 2 
        dfs(a, jug2); 
        // Empty Jug 1 
        dfs(0, b); 
        // Empty Jug 2 
        dfs(a, 0); 
        // Pour Jug 1 into Jug 2 
        int pour = Math.min(a, jug2 - b); 
        dfs(a - pour, b + pour); 
        // Pour Jug 2 into Jug 1 
        pour = Math.min(b, jug1 - a); 
        dfs(a + pour, b - pour); 
    } 
    public static void main(String[] args) { 
        System.out.println("Water Jug Problem using DFS:"); 
        dfs(0, 0); 
    } 
}`,
    theory: `Theory:
Depth First Search (DFS):
Depth First Search (DFS) is an uninformed search technique that explores a search space by
going as deep as possible along one branch before backtracking and exploring another branch.
DFS starts from the initial state, selects a successor state, and continues expanding the
selected branch until the goal state is reached or no further valid state is available.
DFS can be implemented using a stack (LIFO – Last In, First Out) or by using recursion. In a
problem-solving task, each state represents a possible configuration and each valid action
generates a successor state. A visited set is used to avoid repeatedly exploring the same states
when the state space contains cycles.
Key characteristics of DFS:
➢ DFS is an uninformed (blind) search technique.
➢ It explores one branch deeply before backtracking.
➢ It uses a stack or recursion.
➢ It does not require a heuristic function.
➢ It may use less memory than BFS because it mainly stores the current search path and
pending alternatives.
➢ DFS does not necessarily find the shortest solution path.
DFS for Problem Solving:
DFS can be applied to problems such as the Water Jug Problem, Missionaries and Cannibals,
Maze Solving and Blocks World. The problem is represented as a state-space search problem.
The initial state is the starting configuration, the goal state is the required configuration, and
operators/actions generate valid successor states.
DFS follows one possible sequence of actions until it reaches the goal or reaches a dead end. If
a dead end is reached, the algorithm backtracks to the previous state and tries another
available action.
Example – Water Jug Problem:

Consider two jugs of capacity 4 litres and 3 litres. Initially both jugs are empty. The objective is
to obtain exactly 2 litres of water in one of the jugs. The possible actions include filling a jug,
emptying a jug, and transferring water from one jug to another.
Initial State: (0, 0)
Goal State: (2, 0) or (0, 2)
A state is represented as (x, y), where x is the amount of water in the 4-litre jug and y is the
amount of water in the 3-litre jug. DFS explores one sequence of valid operations deeply and
backtracks whenever the selected sequence cannot lead to the goal.
Possible actions:
1. Fill the 4-litre jug.
2. Fill the 3-litre jug.
3. Empty the 4-litre jug.
4. Empty the 3-litre jug.
5. Pour water from the 4-litre jug into the 3-litre jug.
6. Pour water from the 3-litre jug into the 4-litre jug.
DFS Algorithm:
Step 1: Start.
Step 2: Define the initial state and the goal state.
Step 3: Create an empty stack and a visited set.
Step 4: Push the initial state onto the stack and mark it as visited.
Step 5: Pop the top state from the stack.
Step 6: If the selected state is the goal state, reconstruct and display the solution path, then
stop.
Step 7: Otherwise, generate all valid successor states.
Step 8: For each unvisited successor state, store its parent and push it onto the stack.
Step 9: Continue exploring the deepest available state.
Step 10: If a branch reaches a dead end, backtrack by removing states from the current path
and explore another branch.
Step 11: Repeat Steps 5–10 until the goal is reached or the stack becomes empty.
Step 12: If the stack becomes empty without finding the goal, report that no solution was found.
Step 13: Display the sequence of states/actions leading to the goal.
Step 14: Stop.
Advantages and Limitations of DFS:
Advantages:
➢ Simple and easy to implement.

➢ Requires relatively less memory than breadth-oriented search in many search spaces.
➢ Can reach a deep solution without exploring all shallower states first.
➢ Useful for maze solving, state-space exploration and planning problems.
Limitations:
➢ It does not necessarily find the shortest solution.
➢ It can get stuck exploring a deep branch unless visited-state checking or a depth limit is used.
➢ Its performance depends on the order in which successor states are explored.
➢ It may be inefficient for problems where the solution is close to the root but lies in a different
branch.
Conclusion:
DFS was studied as an uninformed search technique for problem solving. The Water Jug
Problem was considered as an example of state-space search, where valid operations generate
successor states. DFS explores one branch deeply and uses backtracking to examine
alternative branches. The solution path can be obtained by maintaining parent information for
the generated states.`
  },
  {
    prNo: 7,
    title: "Implement Backtracking Search to Solve the 8-Queens Constraint Satisfaction Problem",
    code: `import java.util.Arrays; 
public class Main { 
    static int N = 8; 
    static int[] board = new int[N]; 
    static boolean isSafe(int row, int col) { 
        for (int i = 0; i < row; i++) { 
            if (board[i] == col || 
                Math.abs(board[i] - col) == Math.abs(i - row)) { 
                return false; 
            } 
        } 
        return true; 
    } 
    static boolean solve(int row) { 
        if (row == N) 
            return true; 
        for (int col = 0; col < N; col++) { 
            if (isSafe(row, col)) { 
                board[row] = col; 
                if (solve(row + 1)) 
                    return true; 
                board[row] = -1; 
            } 
        } 
        return false; 
    } 
    public static void main(String[] args) { 
        Arrays.fill(board, -1); 
        if (solve(0)) { 
            System.out.println("     8 QUEENS SOLUTION"); 
            System.out.println("  +------------------------+"); 
            for (int i = 0; i < N; i++) { 
                System.out.print((i + 1) + " | "); 
                for (int j = 0; j < N; j++) { 
                    if (board[i] == j) 
                        System.out.print(" Q "); 
                    else 
                        System.out.print(" . "); 
                } 
                System.out.println("|"); 
            } 
            System.out.println("  +------------------------+"); 
            System.out.println("    1  2  3  4  5  6  7  8"); 
            System.out.println("\nAll 8 queens placed successfully!"); 
        } else { 
            System.out.println("No solution exists."); 
        }      }      }`,
    theory: `Theory:
Constraint Satisfaction Problem (CSP):
A Constraint Satisfaction Problem (CSP) is a problem in which a set of variables must be
assigned values from their respective domains while satisfying a set of constraints. A
CSP is commonly represented using three components: variables, domains and
constraints.
For the 8-Queens problem, one practical representation is to use one variable for each
row. The value assigned to a variable represents the column in which the queen is placed.
8-Queens Problem:
The 8-Queens problem requires placing eight queens on an 8 × 8 chessboard so that no
two queens can attack each other. A queen can attack another queen if they are in the
same row, same column, or same diagonal.
CSP representation:
 Variables: Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, where Qi represents the queen placed in
row i.
 Domain: {1, 2, 3, 4, 5, 6, 7, 8}, where the value represents the column number.
 Row constraint: Only one queen is placed in each row because each variable
represents one row.
 Column constraint: No two queens can be placed in the same column.
 Diagonal constraint: For any two queens Qi and Qj, |Qi − Qj| ≠ |i − j|.
Backtracking Search:
Backtracking is a systematic search technique used to solve CSPs. It assigns a value to
one variable at a time. If the current assignment violates any constraint, the algorithm
rejects that value and tries another value. If no value is possible for the current variable,
the algorithm backtracks to the previous variable and changes its assignment.

For the 8-Queens problem, queens are placed row by row. At each row, the algorithm
checks whether a column is safe. If a safe column is found, the queen is placed and the
algorithm moves to the next row. If no safe column is available, the previous queen is
removed and another column is tried.
Input Data / Problem Data:
 Chessboard size: 8 × 8
 Number of queens: 8
 Rows: 1 to 8
 Columns: 1 to 8
 Initial state: No queens placed
 Goal state: Eight queens placed with no pair attacking each other
Constraint Checking:
 Same column: Two queens must not have the same column number.
 Same diagonal: Two queens must not satisfy |column1 − column2| = |row1 − row2|.
 Same row: Automatically avoided because exactly one queen is considered for each
row.
Example Solution:
One valid solution can be represented as [1, 5, 8, 6, 3, 7, 2, 4]. This means:
 Q1 → Row 1, Column 1
 Q2 → Row 2, Column 5
 Q3 → Row 3, Column 8
 Q4 → Row 4, Column 6
 Q5 → Row 5, Column 3
 Q6 → Row 6, Column 7
 Q7 → Row 7, Column 2
 Q8 → Row 8, Column 4

Backtracking Algorithm:
1. Step 1: Start.
2. Step 2: Initialize an empty 8 × 8 chessboard or an empty solution array.
3. Step 3: Start with row 1.
4. Step 4: Try each column from 1 to 8 for the current row.
5. Step 5: Check whether placing a queen at the selected position is safe.
6. Step 6: If the position is safe, place the queen and move to the next row.
7. Step 7: If all eight rows are successfully assigned, a solution is found.
8. Step 8: If the position is not safe, try the next column.
9. Step 9: If no column is safe for the current row, remove the queen from the previous
row and backtrack.
10. Step 10: Try another column for the previous row.
11. Step 11: Continue the process until a solution is found or all possibilities are
exhausted.
12. Step 12: Display the solution and chessboard.
13. Step 13: Stop.

Advantages and Limitations of Backtracking:
Advantages:
 Systematic method for solving constraint satisfaction problems.
 Reduces the search by rejecting invalid partial assignments early.
 Simple to understand and implement using recursion.
 Can be applied to N-Queens, Sudoku, graph coloring and other CSPs.
Limitations:
 The worst-case search space can be large.
 Performance depends on the order in which variables and values are selected.
 For larger N, basic backtracking may require additional heuristics such as forward
checking or MRV.
Conclusion:
The 8-Queens problem was formulated as a Constraint Satisfaction Problem using
variables, domains and constraints. Backtracking search was used to place queens row by
row while checking column and diagonal constraints. Whenever a partial assignment
became invalid, the algorithm backtracked and tried an alternative assignment. A valid
arrangement of eight non-attacking queens was obtained.`
  },
  {
    prNo: 8,
    title: "Develop a Simple Chatbot Using Predefined Rules and Pattern Matching",
    code: `import java.util.Scanner; 
public class chatbot { 
    public static void main(String[] args) { 
        Scanner sc = new Scanner(System.in); 
        String input; 
        System.out.println("Chatbot: Hello! Welcome to Simple Chatbot."); 
        System.out.println("Chatbot: Type 'bye' to exit."); 
        while (true) { 
            System.out.print("You: "); 
            input = sc.nextLine().toLowerCase(); 
            if (input.contains("hello") || input.contains("hi")) { 
                System.out.println("Chatbot: Hello! How can I help you?"); 
            } 
            else if (input.contains("your name")) { 
                System.out.println("Chatbot: I am a simple Java chatbot."); 
            } 
            else if (input.contains("how are you")) { 
                System.out.println("Chatbot: I am fine! How are you?"); 
            } 
            else if (input.contains("college")) { 
                System.out.println("Chatbot: College is a place to learn and grow."); 
            } 
            else if (input.contains("java")) { 
                System.out.println("Chatbot: Java is an object-oriented programming language."); 
            } 
            else if (input.contains("thank")) { 
                System.out.println("Chatbot: You're welcome!"); 
            } 
            else if (input.contains("bye")) { 
                System.out.println("Chatbot: Goodbye! Have a nice day."); 
                break; 
            } 
            else { 
                System.out.println("Chatbot: Sorry, I don't understand that."); 
            } 
        } 
        sc.close(); 
    } 
}`,
    theory: `Theory:
Chatbot:
A chatbot is a computer program that interacts with users through text or voice. A simple
rule-based chatbot does not learn from data. Instead, it uses predefined rules to identify
patterns in the user&#39;s input and returns a corresponding predefined response.
Rule-Based Chatbot:
In a rule-based chatbot, the conversation is controlled using a collection of IF–THEN
rules. The input message is first processed to identify words or patterns. The chatbot
compares these patterns with predefined rules. If a matching rule is found, its associated
response is displayed. If no rule matches, a default response is generated.
Pattern Matching:
Pattern matching is the process of checking whether the user&#39;s input contains a particular
word, phrase or pattern. For example, if the input contains the word &#39;hello&#39;, the chatbot
can match it with a greeting rule and respond with &#39;Hello! How can I help you?&#39;.
Basic Working of the Chatbot:
1. User enters a message.
2. The chatbot converts the input into a suitable form, such as lowercase text.
3. The chatbot checks the input against predefined patterns.
4. If a pattern matches, the corresponding response is selected.
5. If multiple patterns are available, the first applicable rule can be selected.
6. If no pattern matches, the chatbot gives a default response.
7. The conversation continues until the user enters an exit command such as &#39;bye&#39;.

Algorithm:
8. Step 1: Start.
9. Step 2: Define the predefined patterns and corresponding responses.
10. Step 3: Display a welcome message.
11. Step 4: Accept the user&#39;s input.
12. Step 5: Convert the input into lowercase to make matching case-insensitive.
13. Step 6: Check whether the input contains an exit pattern such as &#39;bye&#39;, &#39;exit&#39; or &#39;quit&#39;.
14. Step 7: If an exit pattern is found, display the exit response and stop.
15. Step 8: Otherwise, compare the input with each predefined pattern.
16. Step 9: If a pattern matches, display the corresponding predefined response.

17. Step 10: If no pattern matches, display the default response.
18. Step 11: Repeat Steps 4–10 for the next user input.
19. Step 12: Stop.

Advantages and Limitations of Rule-Based Chatbots:
Advantages:
 Simple and easy to understand.
 Easy to implement using IF–THEN rules.
 Does not require a large training dataset.
 Responses are predictable because they are predefined.
 Useful for simple FAQ and basic customer-support applications.
Limitations:
 Cannot understand complex natural language effectively.
 Cannot generate new responses outside the predefined rules.
 Performance depends on the number and quality of predefined patterns.
 Different ways of asking the same question may not match the same rule.
 It does not learn automatically from previous conversations.
Conclusion:
A simple rule-based chatbot was developed using predefined rules and pattern matching.
The chatbot accepts user input, identifies matching keywords or patterns, and provides a
predefined response. This practical demonstrates the basic working of conversational AI
and provides an introduction to more advanced chatbot techniques such as Natural
Language Processing and machine-learning-based dialogue systems.`
  }
];
